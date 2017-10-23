import moment from 'moment';

function Methods(datepicker) {
    const obj = {
        getValue: (format) => {
            const { range, dateFormat } = datepicker.opts;
            const FORMAT = format || dateFormat;
            const result = datepicker.selectedDates.map(value => moment(value).format(FORMAT.toUpperCase()));
            return range ? result : result[0];
        },
        setValue: (value) => {
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
        }
    };

    return obj;
}

export default Methods;