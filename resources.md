https://base64.guru/converter/decode/image
global.Buffer = require('buffer').Buffer;
This happens because react-native doesn't have window.Buffer defined by default, which the web3.js library is trying to use.

You can fix it by adding to the top of your app:

global.Buffer = require('buffer').Buffer;