var crypto = require('crypto');
var request = require('request');

var ffmpeg = null;
var config = null;
var form = null;

var streamidentifier = null;

// private key to test authentication
var test_key = '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA4VL\/CllrMuMf\/czcR4rKfoWYDU3L+mot0EobUUASXx3dEQYz\ntvVHyIpdfaE9KWyTupG2qnn+iealTGi2PtKE6MA\/G7hHR5uBJ+qIRPckbnLkKDQb\nDlu\/AqA57ELat3V+16u7zfwmaZkKbKofjBfkMqTuxHhjLfWYD51M52tkUPQ69+Bw\nL7qdXNZXNUnOJ8fOtlPUodHOmFcrD2SS34cEplCVqfGChjo5Q840yS2iE+lQk2zr\nVlqWK5uhIUXNMWk4aWSXylfw1w0F+XU+eFQvr16h15B+wb61UmlyIbYq12fNkVDu\n+up1lCfBGAm3GWuYOht5P7mTieNgDvE7FBQ6tQIDAQABAoIBAQDVonRvopJSAChf\n4bFlH4GYbh\/ZVU610aA4YVr\/MUl5532nW4MC0BJMYGv95jdwJCL4\/Jj9j4c3xngp\nNwq8C6u6ZjQvmwvyJ81QRD0Jbm2bTtFmEOkqNvCmk7X3fPeUhBFMeOYqigz9h\/3r\nQ21\/zVMudVRw8VfPxpBzFYhJznehi\/cTssJHj4pTHC6K5NngVLoZr\/GRGyapK2af\nDVVO4crD1elFUmS6mSJV5TOXsw4e6NR\/C0\/AY5z0vD5sOpsP9WbDDhG4JIeK3r1I\n5DeleD0pB61TulYaK5bOaIJX+xZX7C+4tnr1TUaM0\/2VcHz+t1qP8X\/GCwqJ9nik\nEJCig7etAoGBAPcNOKMY9687OLIXZ3U0IRWDc5\/p5aj94yjhpmWofMWtyYZ3oHtb\nNuzdb42sdhpc9\/g\/oGr5AQ1Ch22L0\/+qEzwcPQajjVf03yi0WUBNfQa1HkKiCns9\nY3PxJdkMcwETszIrxGqicbgaSJ4EniEVHtSeDF\/GpZEvFZCKCpFg9CyzAoGBAOl8\nTtf+OEMaJwvI+Ie1RNlABKhzfudg9IbDrO3ajjJGVGNO3FsET5M3mzjSdOdErT68\nH9xcGZNbb1iVONGkY0C8UsLh30jfc1rCqHFvnWqrL8NUdRG1RP\/n8oTQqvrZzoXY\ngrNWoQq5a1cx\/4GRmYAwm1wJUl20s2QilydUD373AoGAYl2DRX01cTHVOyOSb9oX\nqicyrGNGq+iav7ZIuIVDWLn\/WWjcHwGMdvcb6X7Xb1vA57j9uFn4jz0ECxv3hv5C\ntlZP\/gq0xmabS+uy9aVkuHz41XMLVVJ1\/L3xYeBREgaz\/K\/sfsC7IqBkdXZFN8rf\nAa0EJEZFue7TWT99QbEmx30CgYEApuVifmaL1PtWucfYTzk1k419RuP37HCTmdk5\nPXQifLFlFO+D99NnBjaTT9SwF7gxlkxnAd8bsQeE2e8ghEpbYCS9i+xk7PQ8wr2u\nJhfAkET5iUhPvm6yebJU2rdF4LXcODSBiKv9xWqw3c0xdG6dKNKV2v4W0ECgko1f\nOo+N3BUCgYBAABHGLvllEGmrmT18Sf9PR1uPj31UxOHJAVf3LF4eUQThAvtshLii\n7GTPn3fSk\/8rWZVRWBDQMcUgwdh9Ip+UMT9nsalvmysNL0TN2Ci0byT\/WOSL12SY\nj0+lwFxtCX6JrU1R+wdcZggLRPWGsdeHH8iHVoMDR5BUxNJ8KeAs4A==\n-----END RSA PRIVATE KEY-----\n';


function cheesestream(port, streamId) {
    var BufferReader = require('buffer-reader');
    var child = require('child_process');
    var io = require('socket.io');
    var events = require('events');

    var express = require('express')
    var app = express();
    var server = require('http').Server(app);

    var io = require('socket.io')(server);
    var fs = require('fs');
    var querystring = require('querystring');
    // posting port number and live status.
    streamidentifier = streamId.slice(5);

    request.get('http://back3ndb0is.herokuapp.com/login', function(error, response, next){
        name = "Stream";
        responseToken = response.headers.token;

        form = {
            port: port
        };
    
        // var formData = querystring.stringify(form);
        var formData = JSON.stringify(form);
        signature = signToken(formData); 
        var contentLength = formData.length;
    
        console.log(streamidentifier);
        request({
            headers: {
            'name': name,
            'token': responseToken,
            'signature': signature,
            'Content-Type': 'application/json',
            },
            uri: 'http://back3ndb0is.herokuapp.com/streams/' + streamidentifier + '/toggle',
            body: formData,
            method: 'POST'
        }, function (err, res, body) {
            if(!err) { console.log(res) }
        });
    });

    var spawn = child.spawn;
    var exec = child.exec;
    var Emitters = {}
    config = {
        // port:8001,
        //Test url, will always work
        // url:'rtsp://184.72.239.149/vod/mp4:BigBuckBunny_175k.mov'
        url:'rtsp://145.49.53.161:80/' + streamId
    }

    var initEmitter = function(feed){
        if(!Emitters[feed]){
            Emitters[feed] = new events.EventEmitter().setMaxListeners(0)
        }
        return Emitters[feed]
    }
    //Uses the config port, needs a port to send
    console.log('Starting Express Web Server on Port '+port)
    server.listen(port);

    //Always serve index
    app.get('/', function (req, res) {
        res.sendFile(__dirname + '/index.html');
    })

    //FFMPEG pushed stream in here to make a pipe
    var count = 0; //Can be removed later, once android clears their plan up
    //Uses streamIn for incoming feeds, should be cleaned up later
    app.all('/', function (req, res) {
        //Initial emitter
        req.Emitter = initEmitter(req.params.feed)
        res.connection.setTimeout(0);
        //Buffer, handles authentication
        req.on('data', function(buffer){
            req.Emitter.emit('data',buffer)
            var packetNum = buffer

            var CleanBuffer = "";
            //Package checking part
            count++; //Can be removed, ups package count currently
            var reader = new BufferReader(buffer);
            var str = reader.restAll();

            buffer = buffer.toString('hex');
            const CountBuffer = buffer + "::" + count; //Currently used as testing
            /*
            //Check every 5 packages
            if(count % 5 == 0){ 
                //const CountBuffer = buffer + ":" + countor;
                console.log("=======================================")
                console.log(CountBuffer)
                console.log("=======================================")
            }
            //Cleanup Android stuff
            var CleanBuffer = CountBuffer.split('::')[0]
            console.log("================CLEN===================")
            console.log(CleanBuffer)
            console.log("=======================================")
    */
            //Buffer magic | Testing
            //var cheese = Buffer.from(CountBuffer, "hex")
            //console.log(cheese);

            //Converts stream to hex, for file saving
            var savedStream = Buffer.from(buffer, "hex");
            // console.log(savedStream);
            buffer = buffer.toString('hex');
            // console.log(buffer)
            const verify = signToken(savedStream)
            //Saves stream to file
            // fs.appendFile(port +'.mp4', savedStream, function (err) {
            // if (err) throw err;
            // console.log('Saved!');
            // });

            //Savedstream = Clean Buffer, Verify = Hex, used to check and verify stream
            io.to('STREAM_'+req.params.feed).emit('h264',{
                stream:streamidentifier,
                feed:req.params.feed,
                buffer:savedStream, 
                verify: verify
            })
        });
        req.on('end',function(){
            console.log('close');
        });
    })

    //socket.io client commands
    io.on('connection', function (cn) {
        cn.on('f',function (data) {
            switch(data.function){
                case'getStream':
                    console.log(data)
                    cn.join('STREAM_'+data.feed)
                break;
            }
        })
        cn.on('end', () => {
            cn.disconnect()
        })
    });

    //FFMPEG
    console.log('Starting FFMPEG')

    var ffmpegString = '-i '+config.url+' -timeout 3'
    ffmpegString += ' -f mpegts -c:v mpeg1video -codec:a mp2 -b 0 http://localhost:'+port+'/'
    if(ffmpegString.indexOf('rtsp://')>-1){
        ffmpegString='-rtsp_transport tcp '+ffmpegString
    }

    console.log('Executing : ffmpeg '+ffmpegString)
    ffmpeg = spawn('ffmpeg',ffmpegString.split(' '));

    //Handle close
    ffmpeg.on('close', function (buffer) {
        console.log('ffmpeg died')
    })

    //Logs via FFMPEG
    ffmpeg.stderr.on('data', function (buffer) {
       console.log(buffer.toString())
    });
    ffmpeg.stdout.on('data', function (buffer) {
       Emitter.emit('data',buffer)
    });

}

function signToken(data) { // Functie om datas te signen
    if(!data) return false // Om te voorkomen dat alles vastloopt als de data leeg is

    // console.log(test_key);

    let sign = crypto.createSign('RSA-SHA256') // De sign instantie
    // console.log(data);
    sign.write(data) // Het token wordt gesigned 
    sign.end() 
    return sign.sign(test_key, 'hex') // De signature wordt teruggestuurd
}

function deactiveStream() {
    request.get('http://back3ndb0is.herokuapp.com/login', function(error, response, next){
            name = "Stream";
            responseToken = response.headers.token;
            // signature = signToken({token: responseToken}); 
        
            // var formData = querystring.stringify(form);
            // var contentLength = formData.length;

            var formData = JSON.stringify(form);
            signature = signToken(formData); 
            var contentLength = formData.length;
        
            request({
                headers: {
                'Content-Length': contentLength,
                'Content-Type': 'application/json',
                'token': responseToken,
                'signature': signature,
                'name': name
                },
                uri: 'http://back3ndb0is.herokuapp.com/streams/' + streamidentifier + '/toggle',
                body: formData,
                method: 'DELETE'
            }, function (err, res, body) {
                if(!err){ console.log(body) }

            });
        });
}

function killServer() {
    deactiveStream();
    console.log('kill server' + form.port)
}

module.exports = {cheesestream, killServer}