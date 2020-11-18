# castv2-googlehome

# install
## Get VoiceText API key
VoiceText Web API
https://cloud.voicetext.jp/webapi

## required
```bash
$ npm install voicetext castv2-client express fs forever
```

# example
edit speech.js
- RaspberryPi IP
- GoogleHome IP
- VoiceText API key


```bash
$ forever start api.js
$ node speech.js
```

