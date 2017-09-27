const restify = require('restify');
const router = require('./router');

const server = restify.createServer();

router.route(server);

server.listen(9090, () => {
    console.log('mock at port 9090');
});
