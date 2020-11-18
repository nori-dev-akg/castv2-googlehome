# はじめに
これまでは google-home-notifier を使って RaspberryPi からGoogleHomeをしゃべらせていたのだが、RaspberryPi を構築しなおしたら全く動かん！色々調べてみたら動かない記事が沢山あって皆さん苦労しているようだ。castv2-client なるものでも GoogleHomeをしゃべらすことができるらしいのでやってみた。

# 環境
- RaspberryPi 3B
- GoogleHome (私のはminiです)
- 母艦(Windowsマシン。何でも良い)


## Raspberry Pi OS
RaspberryPiのインストールは済んでいるもとします。

```bash
~ $ cat /proc/device-tree/model
Raspberry Pi 3 Model B Rev 1.2

~ $ lsb_release -a
No LSB modules are available.
Distributor ID: Raspbian
Description:    Raspbian GNU/Linux 10 (buster)
Release:        10
Codename:       buster
```

[Raspberry Pi OS：Buster(2020-05-27-raspios-buster-armhf)] (https://qiita.com/nori-dev-akg/items/38c2dfb108edb0d73908)


## Node.js & npm
Node.js/npm が入っていなければインストール。

```bash
~ $ sudo apt-get update
~ $ sudo apt-get upgrade
~ $ sudo apt-get install -y nodejs npm
~ $ sudo npm install n -g
~ $ sudo n stable
# ターミナルを一旦再起動する PATHが再設定される※
~ $ logout

~ $ npm -v
5.8.0
~ $ node -v
v14.15.1

```

ちょっと古い node が入ると思うんで ```sudo n stable``` で 上げた。
v10.21.0 → v14.15.1
*※バージョンが上がっていない場合は ターミナルを再起動すること*

# VoiceText Web API
文字列を合成音に変えてくれるTTS(TextToSpeech)エンジン。
google-tts-api は発声が遅くてよろしくないが VoiceText はクリアでとっても良い！

VoiceText は無料だがAPIキーが必要。メールアドレスだけで取得できる。
[VoiceText Web API](https://cloud.voicetext.jp/webapi)

# モジュールの取得
今回作成したモジュールをgithubに上げてあるので取得する。
https://github.com/nori-dev-akg/castv2-googlehome

```bash
~ $ git clone https://github.com/nori-dev-akg/castv2-googlehome
~ $ cd castv2-googlehome #カレントを移動しておく
~/castv2-googlehome $ npm init --yes #作業用ディレクトリ初期化
#以降、作業用ディレクトリで行う
```

# ライブラリモジュールのインストール
- castv2-client
- voicetext
- express fs
- forever

```bash
~/castv2-googlehome $ npm install voicetext castv2-client express fs forever
```
# 設定
api.js は常に実行させておく必要があるので forever する。

```bash
~/castv2-googlehome $ forever start api.js
```

speech.js ファイルを修正する。

- RaspberryPi のIPアドレス
- GoogleHome のIPアドレス
- VoiceText APIキー
- speaker：任意
- 発声テキスト：任意

~/castv2-googlehome/speech.js

```js
const Castv2GoogleHome = require('./castv2-googlehome.js');

const rapsberrypi_ip = '192.168.0.31';
const googlehome_ip = '192.168.0.200';
const voicetext_key = 'xxxxxxxxxxxxx';

const c2gh = new Castv2GoogleHome(rapsberrypi_ip, googlehome_ip, voicetext_key);

// speaker: 'show', 'haruka', 'hikari', 'takeru', 'santa', 'bear'
c2gh.speech('こんにちは。私はグーグルホームです', 'haruka');

```
# しゃべらせてみる
```bash:
~/castv2-googlehome $ node speech.js
```

GoogleHomeから「こんにちは。私はグーグルホームです」と聞こえれば完成！

# おわりに
モジュール化したので汎用的に使えると思う。
VoiceText の API キーを取得するという手間があるが、「モヤさま」の showくん の声が聞けるのでそれだけの価値はあるかとｗ。
