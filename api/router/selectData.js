const Mock = require('mockjs');

const getData = () => {
    Mock.Random.city();
    const data = Mock.mock({
        'array|1-10': [{
            'id|+1': 1,
            text: '@province(true)'
        }]
    });
    return data.array;
};

module.exports = { getData };