const Mock = require('mockjs');
const http = require('http');

Mock.Random.province();
Mock.Random.city();
const data = Mock.mock({
    'arry|1-10': [{
        'id|+1': 1,
        dateTime: '@dateTime("yyyy-MM-dd")',
        'age|20-80': 22,
        address: '@province(true)'
    }]
});

console.log(data.arry);

