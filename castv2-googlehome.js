const Client = require('castv2-client').Client;
const DefaultMediaReceiver = require('castv2-client').DefaultMediaReceiver;
const fs = require('fs');
const VoiceText = require('voicetext');

var Castv2GoogleHome = function (rasip, ghip, vtkey) {
  this.rasip = rasip;
  this.ghip = ghip
  this.vtkey = vtkey;
}

Castv2GoogleHome.prototype = {
  vcfile: 'voicetext.mp3',
  vcpath: 'voicetext',
  vctmp: '/tmp/voicetext',
  port: 8080,

  convertToText: function(text, speaker) {
    const url = 'http://' + this.rasip + ':' + this.port + '/' + this.vcpath + '/' + this.vcfile;
    const voice = new VoiceText(this.vtkey);
    if(!fs.existsSync(this.vctmp)) {
      fs.mkdirSync(this.vctmp)
    }
    const outpath = this.vctmp + '/' + this.vcfile;

    if(!speaker) {
      speaker = voice.SPEAKER.HIKARI
    }

    return new Promise(function (resolve, reject) {
      voice
        .speaker(speaker)
        .emotion(voice.EMOTION.HAPPINESS)
        .emotion_level(voice.EMOTION_LEVEL.HIGH)
        .volume(150)
        .format('mp3')
        .speak(text, function (e, buf) {
          if (e) {
            console.error(e);
            reject(e);
          } else {
            fs.writeFileSync(outpath, buf, 'binary');
            resolve(url);
          }
        });
    });
  },
  
  speechGoogleHome: function(host, url) {
    const client = new Client();
    client.connect(host, function () {
      client.launch(DefaultMediaReceiver, function (err, player) {
        if (err) {
          console.log(err);
          return;
        }

        player.on('status', function (status) {
          console.log(`status broadcast playerState=${status.playerState} content=${url}`);
        });

        const media = {
          contentId: url,
          contentType: 'audio/mp3',
          streamType: 'BUFFERED'
        };
        player.load(media, { autoplay: true }, function (err, status) {
          client.close();
        });
      });
    });
    client.on('error', function (err) {
      console.log(`Error: ${err.message}, host: ${host}, url: ${url}`);
      client.close();
    });
  },

  speech: function (text, speaker) {
    var c2gh = this;
    this.convertToText(text, speaker).then(function (url, reject) {
      c2gh.speechGoogleHome(c2gh.ghip, url);
    }).catch(function onRejected(error) {
      console.error(error);
    });
  }
};

module.exports = Castv2GoogleHome;