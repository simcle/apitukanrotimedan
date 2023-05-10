const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "1598087",
    key: "9e6e57c2fe24ead7395b",
    secret: "d9a71f7f288556bdf93d",
    cluster: "ap1",
    useTLS: true
});

module.exports = pusher;