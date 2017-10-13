
import 'air-datepicker';
import 'air-datepicker/src/js/i18n/datepicker.zh';
import './style/datepicker.css';
import defaultOptions from './defaults';

!(function ($) {
    $.fn.etDatepicker = function (options) {
        const $self = this;
        const opts = $.extend({}, defaultOptions, options);

        /**
         * 扩展方法
         */
        const protoMethods = {
            /**
             * 设置日期值
             */
            setValue: function (date) {
                let theDate = '';

                if (date) {
                    if (typeof date === 'string') {
                        theDate = new Date(date);
                    } else if (Array.isArray(date)) {
                        theDate = [];

                        date.forEach((item, index) => {
                            theDate.push(new Date(item));
                        });
                    } else if (date instanceof Date) {
                        theDate = date;
                    } else if (date === true) {
                        theDate = new Date();
                    }
                }

                this.selectDate(theDate);
            },

            /**
             * 获取日期
             */
            getValue: function (format) {
                const separator = opts.multipleDatesSeparator;
                const { value } = this.el;
                console.log(this.el);
                console.log(value);
                if (!value) {
                    return '';
                }
                if (format) {
                    if (value.indexOf(separator) !== -1) {
                        let valueArr = value.split(separator);

                        valueArr = valueArr.map((item) => {
                            return protoMethods._formatDate(new Date(item), format);
                        });
                        return valueArr;
                    } else {
                        const theDate = new Date(value);
                        return protoMethods._formatDate(theDate, format);
                    };
                } else {
                    if (value.indexOf(separator) !== -1) {
                        return value.split(separator);
                    } else {
                        return value;
                    };
                }
            },
			/**
			 * 格式化日期
			 * @param  {Date obj} date   [日期对象]
			 * @param  {String} format [格式化yyyy年，mm月，m月为个位月无0，dd日，first_dd一个月的第一天，last_dd一个月的最后一天]
			 * @return {String}        [格式化后日期字符串]
			 */
            _formatDate: function (date, format) {
                if (!format || typeof format !== 'string') {
                    var format = 'yyyy-mm-dd';
                }
                var dateYear = date.getFullYear();
                var dateMonth = date.getMonth() + 1;
                var dateDay = date.getDate();

                dateMonth = dateMonth < 10 ? '0' + dateMonth : dateMonth;
                dateDay = dateDay < 10 ? '0' + dateDay : dateDay;

                // 注意顺序
                if (/yyyy/.test(format)) {
                    format = format.replace(/yyyy/, dateYear);
                }

                if (/mm/.test(format)) {
                    format = format.replace(/mm/, dateMonth);
                } else if (/m/.test(format)) {
                    format = format.replace(/m/, date.getMonth() + 1);
                }
                if (/first_dd/.test(format)) {
                    dateDay = '01';
                    format = format.replace(/first_dd/, dateDay);
                }
                if (/last_dd/.test(format)) {
                    var theLast_dd = new Date(dateYear, dateMonth, 0);
                    dateDay = theLast_dd.getDate();

                    format = format.replace(/last_dd/, dateDay);
                }

                if (/dd/.test(format)) {
                    format = format.replace(/dd/, dateDay);
                } else if (/d/.test(format)) {
                    format = format.replace(/d/, date.getDate());
                }

                return format;
            }
        };

        // 修改参数初始值
        if (opts.range && !opts.multipleDatesSeparator) {
            opts.multipleDatesSeparator = ' 至 ';
        }
        if (opts.multipleDates && !opts.range && !opts.multipleDatesSeparator) {
            opts.multipleDatesSeparator = ', ';
        }
        if (opts.minDate && typeof opts.minDate === 'string') {
            opts.minDate = protoMethods._formatDate(new Date(), opts.minDate);
            opts.minDate = new Date(opts.minDate);
        }
        if (opts.maxDate && typeof opts.maxDate === 'string') {
            opts.maxDate = protoMethods._formatDate(new Date(), opts.maxDate);
            opts.maxDate = new Date(opts.maxDate);
        }
        if (opts.todayButton) {
            opts.todayButton = new Date();
        }
        if (opts.width) {
            $self.get(0).style.width = `${opts.width}px`;
        }

        // 改变事件， 异步，来解决select时拿取不到日期对象的问题
        if (opts.onChanged) {
            opts.onSelect = function (formattedDate, date, inst) {
                const separator = opts.multipleDatesSeparator;
                let theDate = formattedDate;

                if (theDate.indexOf(separator) !== -1) {
                    theDate = theDate.split(separator);
                }

                setTimeout(() => {
                    opts.onChanged(theDate, date, inst);
                }, 10);
            };
        }

        // 生成
        var datepicker = $self.datepicker(opts).data('datepicker');
        // 将protoMethods里自定义的方法，拓展到datepicker原型中
        var $datepicker = $.extend(datepicker, protoMethods);

        //////////////////////////////////////////////////////////////////////////////
        //                            初始化后，参数判断                            //
        //////////////////////////////////////////////////////////////////////////////

        // 是否填写默认日期
        if (opts.defaultDate) {
            const defaultDate = opts.defaultDate;

            // 如果是true显示当天
            if (typeof defaultDate === 'boolean') {

                $datepicker.selectDate(new Date());

                // 如果是指定日期显示指定日期
            } else if (typeof defaultDate === 'string') {

                var stringDate = protoMethods._formatDate(new Date(), defaultDate);
                $datepicker.selectDate(new Date(stringDate));

                // 如果是数组，,multiple 或range范围选择
            } else if (Array.isArray(defaultDate) && (opts.multipleDates || opts.range)) {

                defaultDate.forEach(function (item, index) {
                    if (typeof item === 'string') {

                        item = protoMethods._formatDate(new Date(), item);
                        $datepicker.selectDate(new Date(item));

                    } else if (item instanceof Date) {

                        $datepicker.selectDate(item);

                    }
                })
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

        return $datepicker;
    };
}(jQuery));
