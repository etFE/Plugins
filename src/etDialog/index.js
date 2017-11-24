import './layer/theme/default/layer.css';
import './dialog.css';
import layer from './layer/layer';

// 重置path属性，避免layer自身调用错误路径的css
layer.path = null;

$.etDialog = {
    config: layer.config,
    // ready: layer.ready,
    parentFrameName: null,

    parentFrameNameObj: {},
    getFrameName: function (key) {
        return key ? this.parentFrameNameObj[key] : this.parentFrameName;
    },

    open: function (opts) {
        if (opts.url) {
            opts.content = opts.url;
            opts.type = 2;

            if (opts.btnAlign) {
                if (opts.btnAlign === 'left') {
                    opts.btnAlign = 'l';
                } else if (opts.btnAlign === 'center') {
                    opts.btnAlign = 'c';
                } else if (opts.btnAlign === 'right') {
                    opts.btnAlign = 'r';
                }
            }

            if (opts.width) {
                if (typeof opts.width === 'number') {
                    opts.width += 'px';
                } else if (typeof opts.width === 'string' && opts.width !== 'auto' && opts.width.indexOf('px') === -1) {
                    opts.width += 'px';
                }
            }
            if (opts.height) {
                if (typeof opts.height === 'number') {
                    opts.height += 'px';
                } else if (typeof opts.height === 'string' && opts.height !== 'auto' && opts.height.indexOf('px') === -1) {
                    opts.height += 'px';
                }
            }

            const defOpt = {
                title: 'iFrame层',
                resize: false,
                area: [opts.width, opts.height]
            };
            const options = $.extend({}, defOpt, opts);
            const index = layer.open(options);

            if (opts.isMax) {
                layer.full(index);
            }
            // 获取设置的windows name
            if (opts.frameName) {
                this.parentFrameName = opts.frameName;
            }
            // 获取设置的windows name的对象
            if (opts.frameNameObj && typeof opts.frameNameObj === 'object') {
                const key = Object.keys(opts.frameNameObj)[0];
                this.parentFrameNameObj[key] = opts.frameNameObj[key];
                this.parentFrameName = opts.frameNameObj[key];
            }
            return index;
        }

        return false;
    },

    alert: function (...prams) {
        const [content, yes] = prams;

        return layer.alert(content, yes);
    },

    success: function (...prams) {
        const [content = '成功', yes] = prams;
        const options = {
            icon: 1
        };

        return layer.alert(content, options, yes);
    },
    error: function (...prams) {
        const [content = '错误', yes] = prams;
        const options = {
            icon: 2
        };

        return layer.alert(content, options, yes);
    },
    warn: function (...prams) {
        const [content = '警告', yes] = prams;
        const options = {
            icon: 0
        };

        return layer.alert(content, options, yes);
    },

    confirm: function (...prams) {
        const [content = '提示', yes, cancel] = prams;
        const options = {
            icon: 3
        };

        return layer.confirm(content, options, yes, cancel);
    },
    msg: function (...prams) {
        const [content, end] = prams;

        return layer.msg(content, end);
    },
    load: function () {
        return layer.load(2);
    },
    // tips: function (content) {},

    /**
     * 辅助方法
     */
    close: layer.close,
    closeAll: layer.closeAll,
    changeTitle: layer.title,
    setTop: layer.setTop,
    max: layer.full,
    min: layer.min,
    restore: layer.restore,
    // 当是iframe层时提供的方法
    getChildFrame: layer.getChildFrame,
    getFrameIndex: layer.getFrameIndex,
    iframeAuto: layer.iframeAuto,
    iframeSrc: layer.iframeSrc
};

$.etDialog.config({
    shade: [0.1, '#000']
});
