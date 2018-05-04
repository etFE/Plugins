
import moment from 'moment';
import './js/datepicker';
import './js/datepicker.zh';
import './style/datepicker.css';
import defaultOptions from './defaults';
import initMethod from './methods';

!(function ($) {
    $.fn.etDatepicker = function (options) {
        const $self = this;
        const opts = $.extend({}, defaultOptions, options);

        if (opts.minDate && typeof opts.minDate === 'string') {
            opts.minDate = new Date(opts.minDate);
        }
        if (opts.maxDate && typeof opts.maxDate === 'string') {
            opts.maxDate = new Date(opts.maxDate);
        }
        if (opts.todayButton) {
            opts.todayButton = new Date();
        }
        if (opts.width) {
            $self.get(0).style.width = `${opts.width}px`;
        }

        if (typeof opts.onChange === 'function') {
            opts.onSelect = function (fd, d, inst) {
                let date;
                if (opts.range && d) {
                    date = d.map(v => moment(v).format(opts.dateFormat.toUpperCase()));
                } else {
                    date = fd;
                }
                opts.onChange(date, d, inst);
            };
        }

        // 生成
        const datepicker = $self.airDatepicker(opts).data('datepicker');

        const methods = initMethod(datepicker);

        const $datepicker = $.extend(datepicker, methods);

        // 是否填写默认日期
        if (opts.defaultDate) {
            const { defaultDate } = opts;

            // 如果是true显示当天
            if (typeof defaultDate === 'boolean') {
                $datepicker.selectDate(new Date());
            } else if (typeof defaultDate === 'string') {
                $datepicker.selectDate(new Date(methods.convertDate(defaultDate)));
            } else if (Array.isArray(defaultDate)) {
                if (opts.range && defaultDate.length !== 2) {
                    console.warn('如果range为true，数组defaultDate最好只放两个元素');
                } else if (!opts.range && !opts.multipleDates && defaultDate.length > 1) {
                    console.warn('数组defaultDate最好只放一个元素，或者defaultDate使用字符串类型');
                }

                defaultDate.forEach((item) => {
                    let value;
                    if (item && typeof item === 'boolean') {
                        value = new Date();
                    } else if (typeof item === 'string') {
                        value = new Date(methods.convertDate(item));
                    }

                    $datepicker.selectDate(value);
                });
            }
        }

        // 展示Nav
        if (!opts.showNav) {
            $datepicker.$nav.hide();
        }

        // 只读
        if (opts.readonly) {
            $self.attr('readonly', true);
        }
        $self.addClass('etDatePicker');

        return methods;
    };
}(jQuery));
