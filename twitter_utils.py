import os
import json

from peony import EventStream, PeonyClient, events


class Client(PeonyClient):
    pass


@Client.event_stream
class UserStream(EventStream):
    def stream_request(self):
        return self.stream.statuses.filter.post(track="#europython")

    @events.on_connect.handler
    def connection(self, data):
        print("Connected to stream!")

    @events.on_tweet.handler
    async def tweet(self, data):
        # print(data.text)

        if data.retweeted or 'RT @' in data.text:
            return

        image = None

        try:
            image = data.extended_entities.media[0].media_url_https
        except AttributeError:
            pass

        await self.channel.put(json.dumps({
            'text': data.text,
            'image': image,
            'username': data.user.screen_name,
        }))


def start_client(channel):
    client = Client(
        consumer_key=os.environ['CONSUMER_KEY'],
        consumer_secret=os.environ['CONSUMER_SECRET'],
        access_token=os.environ['ACCESS_TOKEN'],
        access_token_secret=os.environ['ACCESS_TOKEN_SECRET'],
    )

    client.channel = channel

    return client.run_tasks()
