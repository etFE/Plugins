import './etDatepaging.css';

const defaultOptions = {
    minDate: 'week'
};

// 根据参数，配置节点参数
const initOptions = function () {
    const inputElements = {
        $yearLabel: $('<label>年度：</label>'),
        $monthLabel: $('<label>月份：</label>'),
        $weekLabel: $('<label>周数：</label>'),
        $yearInput: $('<input class="dp-year" type="text">'),
        $monthInput: $('<input class="dp-month" type="text">'),
        $weekInput: $('<select class="dp-week" style="width:100px;"></select>')
    };
    const minDateArray = ['week', 'month', 'year'];
    const { minDate } = this.opts;
    const minDateIndex = minDateArray.indexOf(minDate);
    let minDateText;

    this.elements.$yearLabel = minDateIndex <= 2 ? inputElements.$yearLabel : null;
    this.elements.$yearInput = minDateIndex <= 2 ? inputElements.$yearInput : null;
    this.elements.$monthLabel = minDateIndex <= 1 ? inputElements.$monthLabel : null;
    this.elements.$monthInput = minDateIndex <= 1 ? inputElements.$monthInput : null;
    this.elements.$weekLabel = minDateIndex <= 0 ? inputElements.$weekLabel : null;
    this.elements.$weekInput = minDateIndex <= 0 ? inputElements.$weekInput : null;

    if (minDateIndex <= 0) {
        minDateText = '一周';
    } else if (minDateIndex <= 1) {
        minDateText = '一月';
    } else {
        minDateText = '一年';
    }

    this.elements.$prevButton.text(`上${minDateText}`);
    this.elements.$nextButton.text(`下${minDateText}`);
};
// 初始化节点
const initElement = function () {
    const {
        $datepaging,
        $dateForm,
        $prevButton,
        $nextButton
    } = this.elements;

    $datepaging.addClass('etDatepaging');
    $datepaging
        .append($prevButton)
        .append($dateForm)
        .append($nextButton);

    if (this.elements.$yearInput) {
        $dateForm
            .append(this.elements.$yearLabel)
            .append(this.elements.$yearInput);
    }
    if (this.elements.$monthInput) {
        $dateForm
            .append(this.elements.$monthLabel)
            .append(this.elements.$monthInput);
    }
    if (this.elements.$weekInput) {
        $dateForm
            .append(this.elements.$weekLabel)
            .append(this.elements.$weekInput);
    }
};

// 事件处理中心
const setup = function () {
    if (this.elements.$yearInput) {
        this.yearInput = this.elements.$yearInput.etDatepicker({
            view: 'years',
            minView: 'years',
            dateFormat: 'yyyy',
            defaultDate: true
        });
    }
    if (this.elements.$monthInput) {
        this.monthInput = this.elements.$monthInput.etDatepicker({
            view: 'months',
            minView: 'months',
            showNav: false,
            dateFormat: 'MM',
            defaultDate: true
        });
    }
    if (this.elements.$weekInput) {
        this.weekInput = this.elements.$weekInput.etSelect({
            options: [
                { id: 1, text: '第一周' },
                { id: 2, text: '第二周' },
                { id: 3, text: '第三周' },
                { id: 4, text: '第四周' },
                { id: 5, text: '第五周' },
                { id: 6, text: '第六周' }
            ],
            showClear: false
        });
    }

    this.elements.$prevButton.on('click', (params) => {
        if (this.elements.$weekInput && this.weekInput) {
            let curVal = this.weekInput.getValue();

            console.log(this.weekInput)
        }
    });
    this.elements.$nextButton.on('click', (params) => {
        console.log('next');
    });
};

const init = function () {
    initOptions.call(this);
    initElement.call(this);
    setup.call(this);
};

class Datepaging {
    constructor($el, options) {
        this.version = '1.0.0';
        this.pluginName = 'etDatepaging';
        this.elements = {
            $datepaging: $el,
            $prevButton: $('<button class="dp-prev-button"></button>'),
            $nextButton: $('<button class="dp-next-button"></button>'),
            $dateForm: $('<div class="dp-date-form"></div>')
        };
        this.opts = $.extend({}, defaultOptions, options);

        init.call(this);

        return this;
    }
}

$.fn.etDatepaging = function (options) {
    const etDatepaging = new Datepaging(this, options);
    return etDatepaging;
};
