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

const getBaseGrid = () => {
    const data = Mock.mock({
        'Rows|10-30': [{
            dept: '@cword(3,5)',
            'printIndex|+1': 1,
            name: '@cname',
            'sex|1-2': 1,
            personAttr: '@cword(3,5)',
            personOrigin: '@city(true)',
            birthday: '@date("yyyy-MM-dd")',
            'age|20-30': 22,
            nation: '汉族',
            wordDate: '@date("yyyy-MM-dd")',
            'wordYears|3-5': 3,
            joinWorkDate: '@date("yyyy-MM-dd")',
            identity: '23010419808991',
            major: '@cword(3,5)',
            merryState: '@cword(3,5)',
            oldWork: '@cword(3,5)',
            address: '@city(true)',
            telephone: '13000000',
            network: '@url()',
            jobNum: '123',
            personStatus: '@cword(3,5)'
        }]
    });
    const columns = [
        {
            display: '部门', name: 'dept', width: 100, align: 'center'
        },
        {
            display: '打印序号', name: 'printIndex', width: 80, align: 'center'
        },
        {
            display: '姓名', name: 'name', width: 80, align: 'center'
        },
        {
            display: '性别',
            name: 'sex',
            width: 50,
            align: 'center',
            render: function (ui) {
                const value = ui.cellData;
                return value === 1 ? '男' : '女';
            }
        },
        {
            display: '人员属性', name: 'personAttr', width: 100, align: 'center'
        },
        {
            display: '籍贯', name: 'personOrigin', width: 200, align: 'left'
        },
        {
            display: '出生日期', name: 'birthday', width: 100, align: 'center'
        },
        {
            display: '年龄', name: 'age', width: 30, align: 'center'
        },
        {
            display: '民族', name: 'nation', width: 100, align: 'center'
        },
        {
            display: '参加工作时间', name: 'wordDate', width: 100, align: 'center'
        },
        {
            display: '工龄', name: 'wordYears', width: 50, align: 'center'
        },
        {
            display: '进入本单位时间', name: 'joinWorkDate', width: 100, align: 'center'
        },
        {
            display: '身份证号', name: 'identity', width: 120, align: 'center'
        },
        {
            display: '现从事专业', name: 'major', width: 100, align: 'center'
        },
        {
            display: '婚姻状况', name: 'merryState', width: 100, align: 'center'
        },
        {
            display: '原单位', name: 'oldWork', width: 100, align: 'center'
        },
        {
            display: '家庭住址', name: 'address', width: 200, align: 'left'
        },
        {
            display: '手机号', name: 'telephone', width: 100, align: 'center'
        },
        {
            display: '虚拟网', name: 'network', width: 200, align: 'left'
        },
        {
            display: '员工工号', name: 'jobNum', width: 100, align: 'center'
        },
        {
            display: '个人身份', name: 'personStatus', width: 100, align: 'center'
        }
    ];
    return { data, columns };
};

module.exports = { getGridData, getBaseGrid };