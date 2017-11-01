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
            options: [],
            showClear: false
        });
    }

    // 计算周数，起始
    const curYear = this.yearInput.getValue() * 1; // 当前年 转为number类型
    const curMonth = this.monthInput.getValue() * 1; // 当前月
    const curMonthMaxDate = new Date(curYear, curMonth, 0).getDate(); // 当前月最大天数
    const curWeek = new Date(`${curYear}-${curMonth}-01`).getDay() || 7; // 当前周
    const curWeekDays = (7 - curWeek) + 1; // 当前周天数
    const restWeekDays = curMonthMaxDate - curWeekDays; // 剩余周天数
    // 剩余周数
    let restWeeksLength = restWeekDays / 7;
    restWeeksLength = String(restWeeksLength).indexOf('.') > 0 ? Math.floor(restWeeksLength) + 1 : restWeeksLength;
    // 当月周数
    const curWeeksLength = restWeeksLength + 1;

    const weekTextArray = ['第一周', '第二周', '第三周', '第四周', '第五周', '第六周'];
    this.weekInput.clearOptions();
    for (let i = 0; i < curWeeksLength; i++) {
        this.weekInput.addOptions({
            id: i + 1,
            text: weekTextArray[i]
        });
    }
    this.weekInput.setValue(1);
    // 计算周数，结束

    this.elements.$datepaging.on('click', 'button', (e) => {
        let buttonName;
        let step;
        if (e.target.className === 'dp-prev-button') {
            buttonName = 'prev';
            step = -1;
        } else if (e.target.className === 'dp-next-button') {
            buttonName = 'next';
            step = 1;
        }

        // 判断当前最小的是否周
        if (this.elements.$weekInput && this.weekInput) {
            const curWeekVal = this.weekInput.getValue();
            const weekKeys = Object.keys(this.weekInput.getOptions());
            const minWeekVal = weekKeys[0];
            const maxWeekVal = weekKeys[weekKeys.length - 1];

            if (buttonName === 'prev' && curWeekVal === minWeekVal) {
                return;
            }
            if (buttonName === 'next' && curWeekVal === maxWeekVal) {
                return;
            }
            this.weekInput.setValue(Number(curWeekVal) + step);

            // 判断当前最小的是否月
        } else if (this.elements.$monthInput && this.monthInput) {
            const curMonthVal = this.monthInput.getValue();

            if (buttonName === 'prev' && curMonthVal === '1') {
                return;
            }
            if (buttonName === 'next' && curMonthVal === '12') {
                return;
            }
            this.monthInput.setValue(`${Number(curMonthVal) + step}`);
        }
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
