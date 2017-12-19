
import './style/etSelect.css';
import './plugins';
import defaultOptions from './defaults';
import initMethods from './methods';

!(function ($) {
    $.fn.etSelect = function (options) {
        // 合并参数
        const opts = $.extend(true, {}, defaultOptions, options);
        const $self = this;

        // 复选框模式
        if (opts.checkboxMode) {
            opts.maxItems = 'null';
            opts.hideSelected = false;
            opts.showClear = false;
            opts.plugins.push('checkbox_mode');
        }

        /**
         * 初始化函数添加逻辑
         */
        opts.onInitialize = function () {
            const that = this;
            const optList = opts.options || [];
            const onInit = opts.onInit || function () { };
            let defaultValue = opts.defaultValue || '';

            if (defaultValue !== 'none') {
                if (!that.options[defaultValue]) {
                    defaultValue = optList[0] ? optList[0][opts.valueField] : '';
                }
                that.setValue(defaultValue, true);
            }
            setTimeout(() => {
                onInit(defaultValue);
            }, 100);
        };

        // 远程加载
        if (opts.url) {
            $.ajax({
                url: opts.url,
                type: opts.type,
                async: false,
                dataType: 'JSON'
            }).then((res) => { opts.options.push(...res); });
        }
        // 后台检索
        if (!opts.load && opts.backEndSearch) {
            opts.load = function (value) {
                if (!this.settings.url) {
                    return;
                }
                if (this.settings.para) {
                    this.settings.para.key = value;
                } else {
                    this.settings.para = {
                        key: value
                    };
                }
                $.post(
                    this.settings.url,
                    this.settings.para,
                    (res) => {
                        this.clearOptions();
                        this.addOption(res);
                        this.refreshOptions(true);
                    },
                    'json'
                );
            };
            // 取消了前台检索
            opts.score = () => () => 1;
        }

        /**
         * 构造组件
         */
        const select = $self.selectize(opts);

        /**
         * 封装部分逻辑
         */
        if (opts.showClear) {
            select[0].selectize.$clear_button.show();
            if ($self.attr('disabled')) {
                select[0].selectize.$clear_button.hide();
            }
        } else {
            select[0].selectize.$clear_button.hide();
        }

        /**
         * 提供外部接口
         */
        const methods = initMethods(select[0].selectize);

        return $.extend(true, {}, select, methods);
    };
}(jQuery));