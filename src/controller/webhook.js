const fs = require('fs');

exports.webhook = (req, res) => {
    const writer = fs.createWriteStream("attlog.txt")
    writer.write('test');
    writer.end()
}