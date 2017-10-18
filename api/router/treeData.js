const Mock = require('mockjs');

const getTreeDept = () => {
    const data = [
        { id: 1, pid: 0, name: '组织架构' },
        { id: 2, pid: 1, name: '医院办公室' },
        { id: 20001, pid: 2, name: '院办' },
        { id: 20002, pid: 2, name: '综合档案室' },
        { id: 20003, pid: 2, name: '计算机信息管理中心' },
        { id: 3, pid: 1, name: '人事科' },
        { id: 4, pid: 1, name: '医务部' },
        { id: 40001, pid: 4, name: '医务部' },
        { id: 40002, pid: 4, name: '医疗质量监督办公室' },
        { id: 400020001, pid: 40002, name: '住院部' },
        { id: 4000200010001, pid: 400020001, name: '大内科' },
        { id: 4000200010002, pid: 400020001, name: '大外科' },
        { id: 400020002, pid: 40002, name: '门急诊' },
        { id: 4000200020001, pid: 400020002, name: '急诊中心' },
        { id: 4000200020002, pid: 400020002, name: '门诊科室' },
        { id: 400020003, pid: 40002, name: '医技科室' },
        { id: 400020004, pid: 40002, name: '病案统计' },
        { id: 5, pid: 1, name: '护理部' },
        { id: 6, pid: 1, name: '科教科' },
        { id: 7, pid: 1, name: '设备科' },
        { id: 8, pid: 1, name: '财务科' },
        { id: 9, pid: 1, name: '总务处' },
        { id: 10, pid: 1, name: '保卫科' },
        { id: 11, pid: 1, name: '人事科' }
    ];
    return data;
};

module.exports = { getTreeDept };