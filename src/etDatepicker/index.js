
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
            opts.onSelect = function (formattedDate, date, inst) {
                if (opts.range) {
                    date = date.map(v => moment(v).format(opts.dateFormat.toUpperCase()));
                } else {
                    date = formattedDate;
                }
                opts.onChange(date);
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

                // 如果是指定日期显示指定日期
            } else if (typeof defaultDate === 'string') {
                $datepicker.selectDate(new Date(defaultDate));
                // 如果是数组，,multiple 或range范围选择
            } else if (Array.isArray(defaultDate) && (opts.multipleDates || opts.range)) {
                defaultDate.forEach((item, index) => {
                    if (typeof item === 'string') {
                        $datepicker.selectDate(new Date(item));
                    } else if (item instanceof Date) {
                        $datepicker.selectDate(item);
                    }
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
