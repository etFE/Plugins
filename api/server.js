const restify = require('restify');
const router = require('./router');

const server = restify.createServer();

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
});

router.route(server);

server.listen(9090, () => {
    console.log('mock at port 9090');
});
