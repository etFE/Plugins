// 计算当月的，每周日期数组
const calculateWeeksDayArray = function ({
    curYear,
    curMonth,
    curWeek,
    curWeekDays,
    restWeekDays,
    curMonthMaxDays
}) {
    const weeksDaysArray = [];
    weeksDaysArray.push({
        startWeek: curWeek,
        endWeek: 7,
        startDate: `${curYear}-${curMonth}-01`,
        endDate: `${curYear}-${curMonth}-${curWeekDays}`
    });

    const restWeeksLength = restWeekDays / 7;
    const restCompleteWeeksLength = Math.floor(restWeeksLength);

    for (let i = 0; i < restCompleteWeeksLength; i++) {
        weeksDaysArray.push({
            startWeek: 1,
            endWeek: 7,
            startDate: `${curYear}-${curMonth}-${curWeekDays + (7 * i) + 1}`,
            endDate: `${curYear}-${curMonth}-${curWeekDays + (7 * (i + 1))}`
        });
    }

    if (restWeeksLength !== restCompleteWeeksLength) {
        weeksDaysArray.push({
            startWeek: 1,
            endWeek: restWeekDays - (restCompleteWeeksLength * 7),
            startDate: `${curYear}-${curMonth}-${curWeekDays + (7 * restCompleteWeeksLength) + 1}`,
            endDate: `${curYear}-${curMonth}-${curMonthMaxDays}`
        });
    }

    return weeksDaysArray;
};

const calculateWeekAndSet = function (year, month) {
    const curYear = year ? year * 1 : this.yearInput.getValue() * 1; // 当前年 转为number类型
    const curMonth = month ? month * 1 : this.monthInput.getValue() * 1; // 当前月
    const curMonthMaxDays = new Date(curYear, curMonth, 0).getDate(); // 当前月最大天数
    const curWeek = new Date(`${curYear}-${curMonth}-01`).getDay() || 7; // 当前周
    const curWeekDays = (7 - curWeek) + 1; // 当前周天数
    const restWeekDays = curMonthMaxDays - curWeekDays; // 剩余周天数
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

    return calculateWeeksDayArray({
        curYear,
        curMonth,
        curWeek,
        curWeekDays,
        restWeekDays,
        curMonthMaxDays
    });
};