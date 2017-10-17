const restify = require('restify');
const router = require('./router');
const compression = require('compression'); // 压缩中间件用于压缩返回数据  能压缩50%左右

const server = restify.createServer();

// server.use(restify.plugins.bodyParser());
// server.use(restify.plugins.fullResponse());
server.use(compression());
server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    return next();
});

router.route(server);

server.listen(9090, () => {
    console.log('mock at port 9090');
});
