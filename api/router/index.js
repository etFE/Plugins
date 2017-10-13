const { getData } = require('./selectData');
const { getGridData } = require('./gridData');

const route = (server) => {
    server.get('/etSelect', (req, res) => {
        const result = getData();
        res.send(result);
    });
    server.get('/etGrid', (req, res) => {
        const result = getGridData();
        res.send(result);
    });
};

module.exports = { route };

