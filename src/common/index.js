/**
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