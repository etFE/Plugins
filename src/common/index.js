/**
 * 数据请求方法
 * @param {*Object} params
 */
const ajaxPostData = function (params) {
    const options = {
        url: '', // 请求路径
        data: {}, // 请求参数
        success: function () {}, // 成功回调
        error: function () {}, // 失败回调
        delayCallback: false // 是否在success等弹框点击确定后再执行回调函数
    };
    const settings = $.extend(true, {}, options, params);

    const loadIndex = $.etDialog.load();

    $.ajax({
        type: 'POST',
        url: settings.url,
        data: settings.data,
        dataType: 'json',
        success: function (res) {
            $.etDialog.close(loadIndex);

            if (!res) {
                settings.error(res);
                return;
            }

            if (typeof res === 'string') {
                settings.success(res);
                return;
            }

            if (typeof res === 'object') {
                // 成功
                if (res.msg) {
                    if (settings.delayCallback) {
                        $.etDialog.success(res.msg, (index) => {
                            $.etDialog.close(index);
                            settings.success(res);
                        });
                    } else {
                        $.etDialog.success(res.msg);
                        settings.success(res);
                    }

                    // 错误
                } else if (res.error) {
                    if (settings.delayCallback) {
                        $.etDialog.error(res.error, (index) => {
                            $.etDialog.close(index);
                            settings.error(res);
                        });
                    } else {
                        $.etDialog.error(res.error);
                        settings.error(res);
                    }

                    // 警告
                } else if (res.warn) {
                    if (settings.delayCallback) {
                        $.etDialog.warn(res.warn, (index) => {
                            $.etDialog.close(index);
                            settings.error(res);
                        });
                    } else {
                        $.etDialog.warn(res.warn);
                        settings.error(res);
                    }

                    // 正常获取数据
                } else {
                    settings.success(res);
                }
            }
        },
        error: function (XMLHttpRequest, errorMsg) {
            $.etDialog.close(loadIndex);

            const sessionstatus = XMLHttpRequest.getResponseHeader('sessionstatus');

            if (sessionstatus === 'MSG_TIME_OUT') {
                $.etDialog.error('会话超时，请重新登录.');
                // 跳转登录页面
                // window.top.location.href='login.html';
            } else if (sessionstatus === 'NOT_PERMID') {
                $.etDialog.error('没有该操作权限.');
            } else if (sessionstatus === 'TOKEN_MAPPING') {
                $.etDialog.error('重复提交数据.');
            } else if (sessionstatus === 'REQUEST_MAPPING') {
                $.etDialog.error('没有找到对应的请求.');
            } else if (errorMsg === 'parsererror') {
                $.etDialog.error('返回类型不是json.');
            } else if (XMLHttpRequest.status && XMLHttpRequest.status === '404') {
                $.etDialog.error('没有找到对应的请求404.');
            } else {
                $.etDialog.error('操作失败.');
            }
        }
    });
};

/**
 * 辅助函数， 在预定义对象的 prototype上定义方法
 * @param {*} protoArray
 * @param {*} nameToFunc
 */
const defineMethods = function (protoArray, nameToFunc) {
    protoArray.forEach((proto) => {
        const names = Object.keys(nameToFunc);

        for (let i = 0; i < names.length; i++) {
            Object.defineProperty(proto, names[i], {
                enumerable: false,
                configurable: true,
                writeable: true,
                value: nameToFunc[names[i]]
            });
        }
    });
};
/**
 * 类型检测 ==> 检测方法
 */
const isFunction = function (fn) {
    return Object.prototype.toString.call(fn) === '[object Function]';
};
/**
 * 类型检测 ==> 检测纯粹对象
 */
const isPlainObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};
/**
 * 类型检测 ==> 检测数组
 */
const isArray = function (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
};

/**
 * Object.prototype
 * - $clone()
 */
defineMethods([Object.prototype], {
    $clone: function (srcStack, dstStack) {
        const obj = Object.create(Object.getPrototypeOf(this));
        const keys = Object.keys(this);
        let index;
        let prop;

        srcStack = srcStack || [];
        dstStack = dstStack || [];
        srcStack.push(this);
        dstStack.push(obj);
        for (let i = 0; i < keys.length; i++) {
            prop = this[keys[i]];
            if (prop === null || prop === undefined) {
                obj[keys[i]] = prop;
            } else if (isPlainObject(prop)) {
                index = srcStack.lastIndexOf(prop);

                if (index > 0) {
                    obj[keys[i]] = dstStack[index];
                    continue;
                }
            }
            obj[keys[i]] = prop.$clone(srcStack, dstStack);
        }
        return obj;
    },
    $merge: function (...objs) {
        // TODO: 改成自定义写法
        return $.extend({}, this, ...objs);
    }
});

/**
 * Array.prototype
 * - $clone()
 */
defineMethods([Array.prototype], {
    $clone: function (srcStack, dstStack) {
        const thisArr = this.valueOf();
        const newArr = [];
        const keys = Object.keys(thisArr);
        let index;
        let element;

        srcStack = srcStack || [];
        dstStack = dstStack || [];
        srcStack.push(this);
        dstStack.push(newArr);

        for (let i = 0; i < keys.length; i++) {
            element = thisArr[keys[i]];

            if (element === undefined || element === null) {
                newArr[keys[i]] = element;
            } else if (isPlainObject(element)) {
                index = srcStack.lastIndexOf(element);
                if (index > 0) {
                    newArr[keys[i]] = dstStack[index];
                    continue;
                }
            }

            newArr[keys[i]] = element.$clone(srcStack, dstStack);
        }
        return newArr;
    }
});

/**
 * Date.prototype
 * - $clone()
 */
defineMethods([Date.prototype], {
    $clone: function () {
        return new Date(this.valueOf());
    }
});
/**
 * RegExp.prototype
 * - $clone()
 */
defineMethods([RegExp.prototype], {
    $clone: function () {
        const pattern = this.valueOf();
        let flags = '';
        flags += pattern.global ? 'g' : '';
        flags += pattern.ignoreCase ? 'i' : '';
        flags += pattern.multiline ? 'm' : '';
        return new RegExp(pattern.source, flags);
    }
});
/**
 * Number / Boolean / String.prototype
 * - $clone()
 */
defineMethods([
    Number.prototype,
    Boolean.prototype,
    String.prototype
], {
    $clone: function () {
        return this.valueOf();
    }
});
defineMethods([
    Function.prototype
], {
    $clone: function () {
        return this;
    }
});

Object.assign(window, { ajaxPostData });
