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

const getArchives = () => {
    const data = [
        { id: 1, text: '01 在职人员档案库' },
        { id: 2, text: '02 离退人员档案库' },
        { id: 3, text: '03 离退留用人员档案库' },
        { id: 4, text: '04 借用人员档案库' },
        { id: 5, text: '05 调转人员档案库' },
        { id: 6, text: '06 保洁人员档案库' }
    ];
    return data;
};

module.exports = { getData, getArchives };