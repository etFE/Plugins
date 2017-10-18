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
    const data = [
        { id: 1, name: '基本信息' },
        { id: 2, name: '院内岗位' },
        { id: 3, name: '院内职务' },
        { id: 4, name: '学历管理' },
        { id: 5, name: '专业技术职称' },
        { id: 6, name: '工人技术等级' },
        { id: 7, name: '合同管理' },
        { id: 8, name: '临床医师补充协议管理' },
        { id: 9, name: '档案工资管理' },
        { id: 10, name: '人员奖金比例管理' },
        { id: 11, name: '退休管理' },
        { id: 12, name: '指纹管理' },
        { id: 13, name: '辞职管理' },
        { id: 14, name: '五险管理' },
        { id: 15, name: '职业年金' },
        { id: 16, name: '工伤管理' },
        { id: 17, name: '生育险管理' },
        { id: 18, name: '个人简历管理' },
        { id: 19, name: '绩效积分管理' },
        { id: 20, name: '商业保险管理' },
        { id: 21, name: '年休假管理' },
        { id: 22, name: '上岗证管理' },
        { id: 23, name: '全员大会诊记录' },
        { id: 24, name: '投诉情况' },
        { id: 25, name: '纠纷赔偿情况' },
        { id: 26, name: '进修管理' },
        { id: 27, name: '学术会议登记' },
        { id: 28, name: '下乡登记' },
        { id: 29, name: '临时指派登记' },
        { id: 30, name: '解决医院困难记录' },
        { id: 31, name: '新技术新项目' },
        { id: 32, name: '手术权限准入管理' },
        { id: 33, name: '专业技术档案' },
        { id: 34, name: '护理晋级' },
        { id: 35, name: '护理管理' },
        { id: 36, name: '轮转科室' },
        { id: 37, name: '教育培训记录' }
    ];
    return data;
};

module.exports = { getTreeDept, getTreeChild };