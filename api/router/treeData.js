const Mock = require('mockjs');

const getTreeDept = () => {
    const data = [
        { id: 1, pId: 0, name: '组织架构' },
        { id: 2, pId: 1, name: '医院办公室' },
        { id: 20001, pId: 2, name: '院办' },
        { id: 20002, pId: 2, name: '综合档案室' },
        { id: 20003, pId: 2, name: '计算机信息管理中心' },
        { id: 3, pId: 1, name: '人事科' },
        { id: 4, pId: 1, name: '医务部' },
        { id: 40001, pId: 4, name: '医务部' },
        { id: 40002, pId: 4, name: '医疗质量监督办公室' },
        { id: 400020001, pId: 40002, name: '住院部' },
        { id: 4000200010001, pId: 400020001, name: '大内科' },
        { id: 4000200010002, pId: 400020001, name: '大外科' },
        { id: 400020002, pId: 40002, name: '门急诊' },
        { id: 4000200020001, pId: 400020002, name: '急诊中心' },
        { id: 4000200020002, pId: 400020002, name: '门诊科室' },
        { id: 400020003, pId: 40002, name: '医技科室' },
        { id: 400020004, pId: 40002, name: '病案统计' },
        { id: 5, pId: 1, name: '护理部' },
        { id: 6, pId: 1, name: '科教科' },
        { id: 7, pId: 1, name: '设备科' },
        { id: 8, pId: 1, name: '财务科' },
        { id: 9, pId: 1, name: '总务处' },
        { id: 10, pId: 1, name: '保卫科' },
        { id: 11, pId: 1, name: '人事科' }
    ];
    return data;
};

const getTreeChild = () => {
    Mock.Random.city();
    const data = Mock.mock({
        'array|15-20': [{
            'id|+1': 1,
            name: '@province(true)'
        }]
    });
    return data.array;
};

module.exports = { getTreeDept, getTreeChild };