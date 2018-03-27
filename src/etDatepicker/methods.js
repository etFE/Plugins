import moment from 'moment';

function Methods(datepicker) {
    const obj = {
        getValue: (format) => {
            const { range, dateFormat } = datepicker.opts;
            const FORMAT = format || dateFormat;
            const result = datepicker.selectedDates.map(value => moment(value).format(FORMAT.toUpperCase()));
            return range ? result : (result[0] || '');
        },
        setValue: (value) => {
            if (datepicker.$el.prop('disabled')) {
                return;
            }
            let setDate = [];
            if (!value) {
                return;
            }
            if (value instanceof Array) {
                setDate = value;
            } else {
                setDate.push(value);
            }
            setDate = setDate.map(v => new Date(v));
            datepicker.selectDate(setDate);
        },
        clearValue: () => {
            if (datepicker.$el.prop('disabled')) {
                return;
            }
            datepicker.clear();
        },
        disabled: () => {
            datepicker.$el.prop('disabled', 'disabled');
        },
        enabled: () => {
            datepicker.$el.prop('disabled', false);
        },

        /**
         * 转换格式化日期
         * @cvtDate {string}
         * yyyy表示当年，mm表示当月，dd表示当天，fd表示月初，ed表示月末
         * 可自由拆解yyyy-mm-ed,yyyy-10-05,2016-mm-dd
         * @separator {string} 与cvtDate匹配的分隔符
         */
        convertDate: (cvtDate, separator) => {
            separator = separator || '-';
            const year = moment().year();
            const month = moment().month() + 1;
            const date = moment().date();

            cvtDate = cvtDate.replace(/yyyy/i, year);
            cvtDate = cvtDate.replace(/mm/i, month);
            cvtDate = cvtDate.replace(/dd/i, date);
            cvtDate = cvtDate.replace(/fd/i, '01');
            cvtDate = cvtDate.replace(/ed/i, new Date(cvtDate.split(separator)[0], cvtDate.split(separator)[1], 0).getDate());

            return moment(cvtDate, 'YYYY-MM-DD').format('YYYY-MM-DD');
        }
        // convertDate: (cvtDate, separator) => {
        //     separator = separator || '-';
        //     cvtDate = cvtDate.replace(/yyyy/i, moment().year());
        //     cvtDate = cvtDate.replace(/mm/i, moment().month() + 1);
        //     cvtDate = cvtDate.replace(/dd/i, moment().date());

        //     const cvtDateArr = cvtDate.split(separator);

        //     cvtDateArr[2] = cvtDateArr[2].replace(/fd/i, '01');
        //     cvtDateArr[2] = cvtDateArr[2].replace(/ed/i, new Date(cvtDateArr[0], cvtDateArr[1], 0).getDate());

        //     return moment(cvtDateArr.join(separator), 'YYYY-MM-DD').format('YYYY-MM-DD');
        // }
    };

    return obj;
}

export default Methods;