// 默认值
const defaults = {
    colNum: 3, // 表单列数
    fieldItems: [ // 表单字段
        {
            id: 'select',
            name: '下拉框',
            type: 'select',
            width: '250px',
            data: [{ id: '1', text: '测试1' }, { id: '2', text: '测试2' }],
            place: 2
        },
        {
            id: 'text', name: '文本框', type: 'text', width: '250px', place: 1
        },
        {
            id: 'date', name: '日期框', type: 'date', width: '250px', place: 1
        },
        {
            id: 'checkbox', name: '复选框超长超长', type: 'checkbox', place: 1
        },
        {
            id: 'text2', name: '文本框占两列', type: 'text', width: '250px', place: 2
        }
    ],
    onInitElement: function () { }, // 元素构建完成事件
    onInitWidget: function () { }, // 插件构建完成事件
    onInitValidate: function () { } // 验证构建完成事件
};

export default defaults;