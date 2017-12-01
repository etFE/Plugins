let grid;
let $grid;
/**
 * 工具方法 >> 计算节点是否距离底部一定距离
 */
const calculateIsElToBottom = ($el, height) => {
    const offsetTop = $el.offset().top;
    const windowHeight = $(window).height();
    if (windowHeight - offsetTop - $el.height() < height) {
        return false;
    }
    return true;
};

const initDateEditor = function (dateObj, ui) {
    //  点击今天按钮时选择值
    const oldGoToToday = $.datepicker._gotoToday;
    $.datepicker._gotoToday = function (id) {
        oldGoToToday.call(this, id);
        this._selectDate(id);
    };

    const $inp = ui.$cell.find('input');
    const defaultParam = {
        dateFormat: 'yy-mm-dd',
        showButtonPanel: true,
        changeMonth: true,
        changeYear: true,
        closeText: '关闭',
        prevText: '&#x3C;上月',
        nextText: '下月&#x3E;',
        currentText: '今天',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        monthNamesShort: ['一月', '二月', '三月', '四月', '五月', '六月',
            '七月', '八月', '九月', '十月', '十一月', '十二月'
        ],
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        weekHeader: '周',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: true,
        yearSuffix: '年'
    };

    const setting = Object.assign({}, defaultParam, dateObj);
    $inp.datepicker(setting);
};

const initSelectEditor = function (autoCompleteObj, ui) {
    const { $cell } = ui;
    const $inp = $cell.find('input');

    // 添加箭头样式
    $cell.css({ position: 'relative' });
    const $selectArrorw = $('<span></span>');
    $selectArrorw.css({
        display: 'block',
        width: '0',
        height: '0',
        'border-top': '5px solid #333',
        'border-right': '5px solid transparent',
        'border-left': '5px solid transparent',
        position: 'absolute',
        top: '10px',
        right: '10px'
    });
    $cell.append($selectArrorw);

    const defaultParam = {
        selectItem: {
            on: true
        },
        highlightText: {
            on: true
        },
        minLength: 0,
        cacheLength: 20,
        method: 'POST'
    };
    const setting = $.extend(true, {}, defaultParam, autoCompleteObj);
    if (setting.url) {
        /**
         * @description 下拉框数据远程获取
         * @param {any} request [外部输入的字段(传到ajax data)]
         * @param {any} Response [ 此参数是回调函数 取到数据后必须执行此参数方法 如下]
         */
        setting.source = function (request, Response) {
            // 级联查询的参数，key是传参key，field是在rowData查找值的key
            const relyed = ui.column.relyOn;
            let paramArr = [];
            if (relyed) {
                paramArr = relyed.map((item) => {
                    const { key } = item; // 键名
                    const value = ui.rowData[item.field]; // 键值
                    const objP = {};
                    objP[key] = value;
                    return { name: key, value: value };
                });
            }
            // 后台检索
            paramArr.push({
                name: 'key', value: request.term
            });
            $.ajax({
                type: setting.method,
                url: setting.url,
                data: paramArr,
                dataType: 'json',
                // 把 success 事件暴露出来 若有值 则直接覆盖  但Response一定要执行
                success: function (data) {
                    if (typeof setting.success === 'function') {
                        return setting.success(data, Response);
                    }
                    const idF = setting.keyField ? 'id' : setting.valueField;
                    const textF = setting.keyField ? 'text' : setting.textField;
                    // 将原有数据继承 update simon 2017/11/27
                    Response(data.map(item => (
                        $.extend({}, item, {
                            value: item[textF],
                            label: item[textF],
                            id: item[idF]
                        })
                    )));

                    return false;
                }
            });
        };
    }
    // open 事件
    if (typeof setting.open === 'function') {
        setting.open = function (evt, item) {
            return autoCompleteObj.open(ui, item);
        };
    }
    // select事件
    setting.select = function (evt, item2) {
        const { item } = item2;
        if (!item) {
            setting.keyField ?
                ui.rowData[setting.keyField] = '' :
                ui.rowData[setting.valueField] = '';
        } else {
            setting.keyField ?
                ui.rowData[setting.keyField] = item.id :
                ui.rowData[setting.valueField] = item.id;
        }

        if (typeof autoCompleteObj.select === 'function') {
            const { rowData } = ui;
            const cellData = {};
            $.extend(cellData, ui);
            cellData.selected = item;
            delete cellData.rowData;
            return autoCompleteObj.select(rowData, cellData, setting);
        }
        return true;
    };
    // change事件
    setting.change = function (evt, item3) {
        const { item } = item3;
        if (!item) {
            setting.keyField ?
                ui.rowData[setting.keyField] = '' :
                ui.rowData[setting.valueField] = '';
        } else {
            setting.keyField ?
                ui.rowData[setting.keyField] = item.id :
                ui.rowData[setting.valueField] = item.id;
        }
        if (typeof autoCompleteObj.change === 'function') {
            const { rowData } = ui;
            const cellData = {};
            $.extend(cellData, ui);
            cellData.selected = item;
            delete cellData.rowData;
            return autoCompleteObj.change(rowData, cellData, setting);
        }
        return true;
    };
    // focus 事件
    if (typeof setting.focus === 'function') {
        const { rowData } = ui;
        const cellData = {};
        $.extend(cellData, ui);
        // const cellData = { ...ui };
        delete cellData.rowData;
        setting.focus = function (evt, item) {
            cellData.selected = item;
            return autoCompleteObj.focus(rowData, cellData, setting);
        };
    }
    // close 事件
    if (typeof setting.close === 'function') {
        const { rowData } = ui;
        const cellData = {};
        $.extend(cellData, ui);
        // const cellData = { ...ui };
        delete cellData.rowData;
        setting.close = function (evt, item) {
            cellData.selected = item;
            return autoCompleteObj.close(rowData, cellData, setting);
        };
    }
    // create 事件
    if (typeof setting.create === 'function') {
        const { rowData } = ui;
        const cellData = {};
        $.extend(cellData, ui);
        // const cellData = { ...ui };
        delete cellData.rowData;
        setting.create = (evt, item) => {
            cellData.selected = item;
            return autoCompleteObj.create(rowData, cellData, setting);
        };
    }

    if (!calculateIsElToBottom($inp, 250)) {
        setting.position = {
            my: 'left bottom',
            at: 'left top'
        };
    }
    // initialize the editor
    $inp.autocomplete(setting).focus(function () {
        // open the autocomplete upon focus
        $(this).autocomplete('search', '');
    });
};

const initGridEditor = function (editorObj, ui) {
    editorObj.showTop = false;
    editorObj.selectionModel = {
        type: 'row',
        mode: 'single'
    };
    editorObj.stripeRows = false;
    editorObj.editable = false;
    editorObj.resizable = false;

    const $inp = ui.$cell.find('input');
    const { $cell } = ui;
    let { rowIndx } = ui;
    const $this = $(this);
    // const $self = $(this);
    const $invGridHTML = $('<div class="et_select_grid"></div>');
    let $invGrid;
    const relyed = ui.column.relyOn;
    let paramArr = '';
    if (relyed) {
        paramArr = relyed.map((item) => {
            const { key } = item; // 键名
            const value = ui.rowData[item.field]; // 键值
            const objP = {};
            objP[key] = value;
            return { name: key, value: value };
        });
    }
    editorObj.dataModel.getUrl = function () {
        return {
            data: paramArr,
            url: editorObj.dataModel.url
        };
    };
    // 回充值。由于部分数据后台未传。
    // 先获取所有列信息，并对列name赋值空字符串。然后拿后台数据进行扩展
    function rechargeValue(rowData, callback) {
        const columns = $invGrid.getColumns();
        const dataPlhd = {};

        // 遍历下拉表格所有字段，赋予空字符串，避免部分值后台未传而无法覆盖主表的值
        columns.forEach((item) => {
            dataPlhd[item.dataIndx] = '';
        });

        $.extend(dataPlhd, rowData);
        dataPlhd.pq_rowselect = false;
        dataPlhd._rowIndx = rowIndx;
        dataPlhd._rowIndxPage = ui.rowIndxPage;
        $this.pqGrid('updateRow', {
            rowIndx: rowIndx,
            row: dataPlhd
        });

        if (callback) {
            callback();
        }
    }

    // 设置点击事件 回充值
    editorObj.rowClick = (event, ui2 = ui) => {
        event = event || window.event;
        event.stopPropagation();

        rechargeValue(ui2.rowData);
        $invGrid.remove();
    };
    // 渲染grid，添加到body，并定位
    // 确定 子表格top的距离
    let cellOffsetTop = $cell.offset().top + $cell.height();
    // 档子表格处于最底部时，显示在单元格上面
    if ($('body').height() - cellOffsetTop < parseInt(editorObj.height, 10)) {
        cellOffsetTop = $cell.offset().top - parseInt(editorObj.height, 10);
    }
    // 当子表格处于最右边时，自动调换到靠左边的位置
    let cellOffsetLeft = $cell.offset().left;
    if ($('body').width() - $cell.offset().left < parseInt(editorObj.width, 10)) {
        cellOffsetLeft -= parseInt(editorObj.width, 10) - $cell.width();
    }
    $invGrid = $invGridHTML.etGrid(editorObj);
    $invGridHTML
        .appendTo($('body'))
        .css({
            'z-index': '99',
            position: 'absolute',
            top: cellOffsetTop,
            left: cellOffsetLeft
        });


    let [preValue, curValue] = ['', '']; // 先前值 当前值 初始选择的索引
    let selectIndex = 0;
    let timmer = null;

    // 绑定失焦事件
    $inp.get(0).onblur = function () {
        setTimeout(() => {
            $invGridHTML.remove();
        }, 300);
    };

    // 加载完后事件，模糊查询后会再执行
    $invGridHTML.on('pqgridload', () => {
        $invGrid.setSelection(0, false, true);
        selectIndex = 0;

        // 绑定键盘事件
        $inp.get(0).onkeydown = function (event) {
            event = event || window.event;
            const self = this;

            // 操作下拉表格 选择行
            switch (event.keyCode) {
            case 37:
                return;
            case 38:
                // up
                selectIndex--;
                if (selectIndex < 0) {
                    selectIndex = 0;
                }
                $invGrid.setSelection(null);
                $invGrid.setSelection(selectIndex, false, true);
                return;
            case 39:
                return;
            case 40:
            {
                // down
                selectIndex++;
                const rowDataLength = $invGrid.getAllData().length;

                if (selectIndex > rowDataLength - 1) {
                    selectIndex = rowDataLength - 1;
                }
                $invGrid.setSelection(null);
                $invGrid.setSelection(selectIndex, false, true);
                return;
            }
            case 13:
            {
                // 判断是否有行未被选中
                if (!$invGrid.selectGet()[0]) {
                    break;
                }
                const { rowData } = $invGrid.selectGet()[0];
                rechargeValue(rowData, () => {
                    /** *********控制回车键跳单元格****** */
                    const { iKeyNav } = $this.pqGrid('getInstance').grid;
                    const { rowIndxPage } = ui;
                    const offset = $this.pqGrid('getInstance').grid.rowIndxOffset;
                    const colIndx = $this.pqGrid('getColIndx', {
                        dataIndx: ui.dataIndx
                    });
                    let obj2;
                    if (event.shiftKey) {
                        obj2 = iKeyNav._decrEditIndx(rowIndxPage, colIndx);
                    } else {
                        obj2 = iKeyNav._incrEditIndx(rowIndxPage, colIndx);
                    }
                    if (obj2) {
                        rowIndx = obj2.rowIndxPage + offset;
                        iKeyNav.select({
                            rowIndx: rowIndx,
                            colIndx: obj2.colIndx,
                            evt: event
                        });
                    }
                    event.preventDefault();
                });

                return;
            }
            case 9:
            {
                // 如果tab，赋值并开始编辑下一个单元格。
                const { rowData } = $invGrid.selectGet()[0];
                rechargeValue(rowData);
                break;
            }
            default:
                break;
            }
            if (event.shiftKey) {
                return;
            } // 避免与按shift键与回车键时冲突

            clearTimeout(timmer);
            // 模糊查询
            timmer = setTimeout(() => {
                curValue = $(self).val();
                curValue = curValue.replace(/(^\s*)|(\s*$)|(\s*)/g, '');

                if (curValue !== preValue) {
                    $invGrid.pqGrid('option', 'dataModel.getUrl', () => {
                        const param = {
                            key: curValue
                        };

                        return {
                            url: editorObj.dataModel.url,
                            data: param
                        };
                    });
                    $invGrid.pqGrid('refreshDataAndView');

                    preValue = curValue; // 新置前值
                }
            }, 500);
        };
    });
};

const initDefaultEditor = function (editorObj) {
    let prvValue;
    let prvRowData;
    // 在init中拿取先前值，先前行数据
    editorObj.init = (ui) => {
        prvValue = ui.cellData;
        prvRowData = ui.rowData;
    };
    editorObj.getData = (ui) => {
        const { $cell } = ui;
        const curValue = $cell.find('input').val();
        const curRowData = $.extend({}, prvRowData);
        // const curRowData = { ...prvRowData };
        curRowData[ui.dataIndx] = curValue;
        // 判断是否改变值，来放置钩子
        if (prvValue !== curValue) {
            const curCellMsg = ui;
            curCellMsg.currentValue = curValue;
            curCellMsg.previousValue = prvValue;
            if (typeof editorObj.change === 'function') {
                // 用异步来解决还获取不到表格数据的问题 update.wsj.2017.9.8
                setTimeout(() => {
                    editorObj.change(curRowData, curCellMsg);
                }, 100);
            }
        }
        return curValue;
    };
};

/**
 * 构造日期控件
 */
function dateEditor(dateObj) {
    return function (ui) {
        initDateEditor.call(this, dateObj, ui);
    };
}

/**
 * 构造下拉框编辑框
 */
function autoCompleteEditor(autoCompleteObj) {
    return function (ui) {
        initSelectEditor.call(this, autoCompleteObj, ui);
    };
}

/**
 * 构造表格编辑框
 */
function gridEditor(editorObj) {
    return function (ui) {
        initGridEditor.call(this, editorObj, ui);
    };
}

/**
 * 构造动态编辑类型
 * @param {*obj} editorObj 编辑器参数
 */
function dynamicEditor(editorObj) {
    return function (ui) {
        const { dynamic } = editorObj;

        switch (dynamic) {
        case 'select':
            initSelectEditor.call(this, editorObj, ui);
            break;
        case 'date':
            initDateEditor.call(this, editorObj, ui);
            break;
        case 'grid':
            initGridEditor.call(this, editorObj, ui);
            break;
        default:
            break;
        }
    };
}

function initEditor(editorObj) {
    if (editorObj.dynamic) {
        // 使用动态类型
        editorObj.init = dynamicEditor(editorObj);
    } else if (editorObj.type === 'select') {
        editorObj.init = autoCompleteEditor(editorObj);
    } else if (editorObj.type === 'date') {
        editorObj.init = dateEditor(editorObj);
    } else if (editorObj.type === 'grid') {
        editorObj.init = gridEditor(editorObj);
    } else {
        initDefaultEditor(editorObj);
    }
    editorObj.type = 'textbox'; // 给PGgrid传值type为'textbox'
}

// 替换字段
const replaceField = (item) => {
    item.title = item.display;
    item.dataIndx = item.name;
    item.sortable = item.isSort;
    if (item.totalSummary) {
        item.summary = {};
        item.summary.title = item.totalSummary.display;
    }
    delete item.display;
    delete item.name;
    delete item.isAllowHide;
    delete item.isSort;
    delete item.totalSummary;
};

// 替换选项
function replaceOption(obj) {
    const result = obj.columns.map((item) => {
        if (item.editor) {
            initEditor(item.editor);
        }

        if (item.columns) {
            item.colModel = replaceOption(item);
        }
        replaceField(item);

        return item;
    });
    return result;
}

function buildGrid(a, b) {
    grid = a;
    $grid = b;
}

/**
* @description  构造复选框列的函数
*/
function createCheckBoxColumn(options2) {
    const checkboxColumn = {
        title: '',
        // title: '<input class='et-allCheckBox' type='checkbox'>',
        dataIndx: 'et_checkBox',
        width: 30,
        minWidth: 30,
        align: 'center',
        type: 'checkBoxSelection',
        cls: 'ui-state-default',
        resizable: false,
        editable: false,
        sortable: false
    };
    options2.colModel.unshift(checkboxColumn);
    if (options2.selectionModel.mode === 'single') {
        options2.selectionModel.cbHeader = false;
    }
}

function hoverShowTitle($self, opts) {
    $self.on('mouseover', 'td.pq-grid-cell', function () {
        const $thisCell = $(this);
        const cellMsg = $self.pqGrid('getCellIndices', {
            $td: $thisCell
        }); // 获取单元格信息
        const currentDataIndx = cellMsg.dataIndx; // 当前单元格name
        let currentRowIndx = $thisCell.parent().attr('pq-row-indx');
        currentRowIndx = Number(currentRowIndx);

        // 如果是复选框单元格，返回
        if (currentDataIndx === 'et_checkBox') {
            return;
        }

        // 如果是true，每个单元格都会显示title
        if (typeof opts.hoverShowTitle === 'boolean') {
            $thisCell.prop('title', $thisCell.text());
        } else if (typeof opts.hoverShowTitle === 'function') {
            const currentRowData = $self.pqGrid('getRowData', {
                rowIndx: currentRowIndx
            });
            const ui = {
                rowIndx: currentRowIndx,
                dataIndx: currentDataIndx,
                rowData: currentRowData
            };

            const showTitleObj = opts.hoverShowTitle(ui);

            if (typeof showTitleObj === 'object') {
                Object.keys(showTitleObj).forEach((item) => {
                    if (currentDataIndx === item) {
                        if (typeof showTitleObj[item] === 'boolean' && showTitleObj[item]) {
                            $thisCell.prop('title', $thisCell.text());
                        } else {
                            $thisCell.prop('title', showTitleObj[item]);
                        }
                    }
                });
            }
        }
    });
    $self.on('mouseout', 'td.pq-grid-cell', function () {
        if ($(this).attr('title')) {
            $(this).removeAttr('title');
        }
    });
}
export { replaceOption, buildGrid, createCheckBoxColumn, hoverShowTitle };

