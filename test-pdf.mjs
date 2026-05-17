import fs from 'fs';
import pdfParse from 'pdf-parse';

const dataBuffer = fs.readFileSync('Resume Alex 2026.pdf');

pdfParse(dataBuffer).then(function(data) {
    console.log(data.text);
}).catch(console.error);
