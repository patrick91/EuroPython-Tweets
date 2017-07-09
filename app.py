import asyncio
from aiohttp import web
from aiohttp_sse import sse_response
from aiochannel import Channel


from twitter_utils import start_client


async def tweets(request):
    channel = Channel(10, loop=app.loop)

    app.channels.append(channel)

    resp = await sse_response(request, headers={
        'Access-Control-Allow-Origin': '*'
    })

    async with resp:
        x = await channel.get()
        resp.send(x)

    app.channels.remove(channel)

    return resp

app = web.Application()
app.channels = []


asyncio.async(start_client(app.channels))

app.router.add_route('GET', '/tweets', tweets)

web.run_app(app, host='0.0.0.0', port=5000)
