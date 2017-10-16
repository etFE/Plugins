const { getData } = require('./selectData');
const { getGridData } = require('./gridData');
const fs = require('fs');

const route = (server) => {
    server.get('/etSelect', (req, res) => {
        const result = getData();
        res.send(result);
    });
    server.get('/etGrid', (req, res) => {
        const result = getGridData();
        res.send(result);
    });
    server.post('/etUpload', (req, res) => {
        const chunks = [];
        req.on('data', (chunk) => {
            chunks.push(chunk);
        });
        req.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const path = 'C:\\Users\\41756\\Desktop\\testUpload\\image.jpg';
            fs.writeFile(path, buffer, () => {
                res.send('upload success');
            });
        });
    });
};

module.exports = { route };

