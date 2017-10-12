const Mock = require('mockjs');

const getGridData = () => {
    const data = Mock.mock({
        'array|1-1000': [{
            'rank|+1': 1,
            company: '@title(3, 5)',
            orderDate: '@date(yyyy-MM-dd)',
            'revenues|10000-100000.1-10': 20000,
            'profits|1000-10000.1-10': 2000
        }]
    });
    return data.array;
};

module.exports = { getGridData };