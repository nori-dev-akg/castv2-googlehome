const Castv2GoogleHome = require('./castv2-googlehome.js');

const rapsberrypi_ip = '192.168.0.31';
const googlehome_ip = '192.168.0.200';
const voicetext_key = 'xxxxxxxxxxxxxxx';

const c2gh = new Castv2GoogleHome(rapsberrypi_ip, googlehome_ip, voicetext_key);

// speaker: 'show', 'haruka', 'hikari', 'takeru', 'santa', 'bear'
c2gh.speech('こんにちは。私はグーグルホームです', 'haruka');

