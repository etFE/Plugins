import 'icheck';
import './style/icheck.css';
import defaultOptions from './defaults';

!(function ($) {
    $.fn.etCheck = function (options) {
        const $self = this;
        const opts = $.extend({}, defaultOptions, options);

        const checkObj = {
            status: '123',
            checked: false,
            disabled: false,
            options: opts
        };


        $self.on('ifCreated', () => {
            if (opts.created) {
                opts.created();
            }

            // 设置状态
            if (opts.checked) {
                $self.prop('checked', true);
                checkObj.checked = true;
                checkObj.status = 'checked';
            }
            if (opts.disabled) {
                $self.prop('disabled', true);
                checkObj.disabled = true;
                checkObj.status = 'disabled';
            }
        });
        // 被销毁时
        $self.on('ifDestroyed', () => {
            if (opts.destroyed) {
                opts.destroyed();
            }
        });
        // 选择时
        $self.on('ifChecked', () => {
            if (opts.ifChecked) {
                opts.ifChecked();
            }
        });
        // 取消选择时
        $self.on('ifUnchecked', () => {
            if (opts.ifUnchecked) {
                opts.ifUnchecked();
            }
        });
        // 被禁用时
        $self.on('ifDisabled', () => {
            if (opts.ifDisabled) {
                opts.ifDisabled();
            }
        });
        // 被启用时
        $self.on('ifEnabled', () => {
            if (opts.ifEnabled) {
                opts.ifEnabled();
            }
        });

        // 点击时。
        $self.on('ifClicked', () => {
            if (opts.ifClicked) {
                opts.ifClicked();
            }
        });
        // 状态改变时
        $self.on('ifChanged', () => {
            if ($self.get(0).disabled) {
                checkObj.status = 'disabled';
                checkObj.disabled = true;
            } else {
                if ($self.get(0).checked) {
                    checkObj.status = 'checked';
                } else {
                    checkObj.status = 'unchecked';
                }
                checkObj.disabled = false;
            }
            if (opts.ifChanged) {
                opts.ifChanged(checkObj.status, checkObj.checked, checkObj.disabled);
            }
        });
        // toggle。因为click 》toggle 》change。在click时状态还未附上。所以状态判断放这里
        $self.on('ifToggled', () => {
            if ($self.get(0).checked) {
                checkObj.status = 'checked';
                checkObj.checked = true;
            } else {
                checkObj.status = 'unchecked';
                checkObj.checked = false;
            }
            if (opts.ifToggled) {
                opts.ifToggled(checkObj.checked);
            }
        });

        const methods = {
            setCheck: function (fn) {
                $self.iCheck('check', fn);
                return this;
            },
            setUncheck: function (fn) {
                $self.iCheck('uncheck', fn);
                return this;
            },
            setToggle: function (fn) {
                $self.iCheck('toggle', fn);
                return this;
            },
            setDisable: function (fn) {
                $self.iCheck('disable', fn);
                return this;
            },
            setEnable: function (fn) {
                $self.iCheck('enable', fn);
                return this;
            },
            setUpdate: function (fn) {
                $self.iCheck('update', fn);
                return this;
            }
        };

        const $check = $self.iCheck(opts);

        checkObj.$el = $check;

        const result = $.extend(checkObj, methods);
        console.log($check);

        return checkObj;
    };
}(jQuery));
