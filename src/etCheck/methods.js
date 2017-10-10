/**
 * 生成组件方法
 * @param {object} check
 */
function Methods(check) {
    const obj = {
        setCheck: (fn) => {
            check.iCheck('check', fn);
        },
        setUncheck: (fn) => {
            check.iCheck('uncheck', fn);
        },
        setToggle: (fn) => {
            check.iCheck('toggle', fn);
        },
        setDisable: (fn) => {
            check.iCheck('disable', fn);
        },
        setEnable: (fn) => {
            check.iCheck('enable', fn);
        },
        setUpdate: (fn) => {
            check.iCheck('update', fn);
        }
    };

    return obj;
}

export default Methods;