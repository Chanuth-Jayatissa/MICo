const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('Resume Alex 2026.pdf');

pdf(dataBuffer).then(function(data) {
    console.log(data.text);
});
