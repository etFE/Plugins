const defaults = {
    defaultDate: false, // 默认显示日期
    todayButton: true, // “今日”按钮
    clearButton: true, // “清除”按钮
    autoClose: true, // 选择完后自动关闭。默认false
    toggleSelected: false, // false时可以选择同一天，true时点同一天取消选择
    showNav: true,
    readonly: true,
    language: 'zh',
    multipleDatesSeparator: ' 至 ',
    dateFormat: 'yyyy-mm-dd'
    // onSelect: function (formattedDate, date, inst) {},
    // onShow: function (inst, animationCompleted) {},
    // onHide: function (inst, animationCompleted) {},
    // onChangeMonth: function (month, year) {},
    // onChangeYear: function (year) {},
    // onChangeDecade: function (decade) {},
    // onChangeView: function (view) {},
    // onRenderCell: function (date, cellType) {}
};

export default defaults;