/**
 * 生成组件方法
 * @param {object} check
 */
function Methods(check) {
    const obj = {
        setCheck: function (fn) {
            check.iCheck('check', fn);
            return this;
        },
        setUncheck: function (fn) {
            check.iCheck('uncheck', fn);
            return this;
        },
        setToggle: function (fn) {
            check.iCheck('toggle', fn);
            return this;
        },
        setDisable: function (fn) {
            check.iCheck('disable', fn);
            return this;
        },
        setEnable: function (fn) {
            check.iCheck('enable', fn);
            return this;
        },
        setUpdate: function (fn) {
            check.iCheck('update', fn);
            return this;
        }
    };

    return obj;
}

export default Methods;