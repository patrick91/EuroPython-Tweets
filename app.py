import asyncio
from aiohttp import web
from aiohttp.web import Response
from aiohttp_sse import sse_response
from aiochannel import Channel


from twitter_utils import start_client


async def tweets(request):
    # loop = request.app.loop
    resp = await sse_response(request, headers={
        'Access-Control-Allow-Origin': '*'
    })

    async with resp:
        x = await request.app.channel.get()
        resp.send(x)

    return resp


async def index(request):
    d = """
        <html>
        <head>
            <script type="text/javascript"
                src="http://code.jquery.com/jquery.min.js"></script>
            <script type="text/javascript">
            var evtSource = new EventSource("/tweets");
            evtSource.onmessage = function(e) {
             $('#response').append(e.data);
            }

            </script>
        </head>
        <body>
            <h1>Response from server:</h1>
            <div id="response"></div>
        </body>
    </html>
    """
    return Response(text=d, content_type='text/html')


app = web.Application()

app.channel = Channel(100, loop=app.loop)

asyncio.async(start_client(app.channel))

app.router.add_route('GET', '/tweets', tweets)
app.router.add_route('GET', '/', index)

web.run_app(app, host='127.0.0.1', port=5000)
