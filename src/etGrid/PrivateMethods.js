/**
 * @description 计算指定列的合计数据
 * @param {array} columns 列名
 * @returns 合计数据的对象
 */
function _getTotalSummary($self, columns) {
    const summary = {};
    const arrayData = $self.pqGrid('option', 'dataModel.data');
    for (let n = 0; n < columns.length; n++) {
        let total = 0;
        const key = columns[n];
        if (arrayData) {
            for (let i = 0, lgh = arrayData.length; i < lgh; i++) {
                let data = arrayData[i][key];
                if (!data) {
                    data = 0;
                }
                total += parseFloat(data);
            }
        }
        summary[key] = total.toFixed(2);
    }
    return summary;
}
/**
 * @description 计算平均数据
 * @param {Array} cols 列名 数组
 * @returns  各个不同列名值为平均数据的对象
 */
function _getAverageSummary($self, cols) {
    const totals = _getTotalSummary($self, cols);
    let arrayData = $self.pqGrid('option', 'dataModel.data');
    const averages = {};
    if (!arrayData) {
        arrayData = [];
    }
    //  产生平均数据
    Object.keys(totals).forEach((i) => {
        if (!arrayData.length) {
            averages[i] = 0;
        } else {
            averages[i] = (totals[i] / arrayData.length).toFixed(2);
        }
    });
    return averages;
}
/**
 * @description 计算数据指定列的最大值或最小值
 * @param {Array} cols 列名
 * @param {any} type 'min'/'max'
 * @returns 返回计算出的数据指定列的最大值或最小值 对象
 */
function _getMaxAndMinSummary($self, cols, type) {
    const maxSummary = {};
    const minSummary = {};
    const arrayData = $self.pqGrid('option', 'dataModel.data');
    for (let n = 0, len = cols.length; n < len; n++) {
        const key = cols[n];
        const arr = [];
        if (arrayData) {
            for (let i = 0, len2 = arrayData.length; i < len2; i++) {
                let data = arrayData[i][key];
                if (!data) {
                    data = 0;
                }
                arr.push(data);
            }
        }
        if (arr.length) {
            maxSummary[key] = Math.max.apply(null, arr);
            minSummary[key] = Math.min.apply(null, arr);
        } else {
            maxSummary[key] = 0;
            minSummary[key] = 0;
        }
    }
    if (type === 'max') {
        return maxSummary;
    } else if (type === 'min') {
        return minSummary;
    }
}
/**
 * @description 给Summary行集合填充值
 * @returns   Summary行集合的数组
 */
function _fillSummaryData($self, opts) {
    const summaryRows = [];
    const keyWord = opts.summary.keyWordCol; // 获取关键字所在列的列名
    const optSummary = opts.summary;
    if (!keyWord) {
        alert('请输入关键字所在列的列名');
        return false;
    }
    if (optSummary.totalColumns instanceof Array && optSummary.totalColumns.length) {
        const total = _getTotalSummary($self, optSummary.totalColumns);
        total[keyWord] = '<b>合计:</b>';
        total.pq_rowcls = 'green';
        summaryRows.push(total);
    }
    if (optSummary.averageColumns instanceof Array && optSummary.averageColumns.length) {
        const average = _getAverageSummary($self, optSummary.averageColumns);
        average[keyWord] = '<b>平均值:</b>';
        average.pq_rowcls = 'yellow';
        summaryRows.push(average);
    }
    if (optSummary.maxColumns instanceof Array && optSummary.maxColumns.length) {
        const maxData = _getMaxAndMinSummary($self, optSummary.maxColumns, 'max');
        maxData[keyWord] = '<b>最大值:</b>';
        summaryRows.push(maxData);
    }
    if (optSummary.minColumns instanceof Array && optSummary.minColumns.length) {
        const minData = _getMaxAndMinSummary($self, optSummary.minColumns, 'min');
        minData[keyWord] = '<b>最小值:</b>';
        summaryRows.push(minData);
    }
    return summaryRows;
}

export { _getTotalSummary, _fillSummaryData };