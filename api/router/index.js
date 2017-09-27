const { getData } = require('./selectData');

const route = (server) => {
    server.get('/etSelect', (req, res) => {
        const result = getData();
        res.send(result);
    });
};

module.exports = { route };

