import defaultOptions from './default';

!(function ($) {
    $.fn.etGrid = function (options) {
        const $self = this;
        const opts = $.extend(true, {}, defaultOptions, options);
        let $grid;
        /**
     * @description 把参数对象的列属性转换成合适pqgrid的列属性
     * @param {any} obj 参数对象的列属性
     * @returns  合适pqgrid的列属性
     */

        function filterColumn(obj) {
            /**
             * @description 构造表格编辑框
             * @param {any} obj  传入参数对象
             * @returns
             */
            function gridEditor(editorObj) {
                editorObj.showTop = false;
                editorObj.selectionModel = {
                    type: 'row',
                    mode: 'single'
                };
                editorObj.stripeRows = false;
                editorObj.editable = false;
                editorObj.resizable = false;
                return function (ui) {
                    const $inp = ui.$cell.find('input');
                    const { $cell } = ui;
                    let { rowIndx } = ui;
                    const $this = $(this);
                    const $invGridHTML = $('<div class="et_select_grid"></div>');
                    let $invGrid;
                    // 回充值。由于部分数据后台未传。
                    // 先获取所有列信息，并对列name赋值空字符串。然后拿后台数据进行扩展
                    function rechargeValue(rowData, callback) {
                        const columns = $invGrid.getColumns();
                        let dataPlhd = {};

                        columns.forEach((item) => { dataPlhd[item.dataIndx] = ''; });

                        // dataPlhd = $.extend(dataPlhd, rowData);
                        dataPlhd = { ...rowData };
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

                        $this.remove();
                    };
                    /* editorObj.rowClick = function (event, ui2) {
                        event = event || window.event;
                        event.stopPropagation();

                        rechargeValue(ui.rowData);

                        $(this).remove();
                    }; */

                    // 渲染grid，添加到body，并定位
                    $invGrid = $invGridHTML.etGrid(editorObj);
                    $invGridHTML
                        .appendTo($('body'))
                        .css({
                            'z-index': '99',
                            position: 'absolute',
                            top: $cell.offset().top + $cell.height(),
                            left: $cell.offset().left
                        });


                    let [preValue, curValue] = ['', '']; // 先前值 当前值 初始选择的索引
                    let selectIndex = 0;
                    let _timmer = null;

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
                            const _this = this;

                            // 操作下拉表格 选择行
                            switch (event.keyCode) {
                            case 37:
                                break;
                            case 38:
                                // up
                                selectIndex--;
                                if (selectIndex < 0) {
                                    selectIndex = 0;
                                }
                                $invGrid.setSelection(null);
                                $invGrid.setSelection(selectIndex, false, true);
                                break;
                            case 39:
                                break;
                            case 40: {
                                // down
                                selectIndex++;
                                const rowDataLength = $invGrid.getAllData().length;

                                if (selectIndex > rowDataLength - 1) {
                                    selectIndex = rowDataLength - 1;
                                }
                                $invGrid.setSelection(null);
                                $invGrid.setSelection(selectIndex, false, true);
                                break;
                            }
                            case 13: {
                                // 判断是否有行未被选中
                                if (!$invGrid.selectGet()[0]) {
                                    break;
                                }
                                const { rowData } = $invGrid.selectGet()[0];
                                rechargeValue(rowData, () => {
                                    /** *********控制回车键跳单元格****** */
                                    const { iKeyNav } = $grid.getInstance();
                                    const { rowIndxPage } = ui;
                                    const offset = $grid.getInstance().rowIndxOffset;
                                    const colIndx = $grid.getColIndx(ui.dataIndx);
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

                                /** ******************** */
                                break;
                            }
                            case 9: {
                                // 如果tab，赋值并开始编辑下一个单元格。
                                const { rowData } = $invGrid.selectGet()[0];
                                rechargeValue(rowData);
                                break;
                            }
                            default: return;
                            }
                            if (event.shiftKey) return false; // 避免与按shift键与回车键时冲突

                            clearTimeout(_timmer);
                            // 模糊查询
                            _timmer = setTimeout(() => {
                                curValue = $(_this).val();
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
            }

            /**
             * @description  构造日期控件
             * @param {any} obj 传入参数对象
             * @returns
             */
            function dateEditor(dateObj) {
                //  点击今天按钮时选择值
                const oldGoToToday = $.datepicker._gotoToday;
                $.datepicker._gotoToday = function (id) {
                    oldGoToToday.call(this, id);
                    this._selectDate(id);
                };

                return function (ui) {
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
                    // const setting = $.extend({}, defaultParam, dateObj);
                    const setting = Object.assign({}, defaultParam, dateObj);
                    $inp.datepicker(setting);
                };
            }

            /**
             * @description 构造下拉框编辑框
             * @param {any} obj 传入参数对象
             * @returns
             */
            function autoCompleteEditor(autoCompleteObj) {
                return function (ui) {
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
                            $.ajax({
                                type: setting.method,
                                url: setting.url,
                                data: request,
                                dataType: 'json',
                                // 把 success 事件暴露出来 若有值 则直接覆盖  但Response一定要执行
                                success: function (data) {
                                    if (typeof setting.success === 'function') {
                                        return setting.success(data, Response);
                                    } else {
                                        Response($.map(data, (item) => {
                                            if (setting.keyField) {
                                                return {
                                                    value: item.text,
                                                    label: item.text,
                                                    id: item.id
                                                };
                                            } else {
                                                return {
                                                    value: item[setting.textField],
                                                    label: item[setting.textField],
                                                    id: item[setting.valueField]
                                                };
                                            }
                                        }));
                                    }
                                }
                            });
                        };
                    }

                    if (typeof setting.open === 'function') {
                        setting.open = function (evt, item) {
                            return autoCompleteObj.open(ui, item);
                        };
                    }
                    setting.select = function (evt, item2) {
                        const { item } = item2;
                        if (!item) {
                            ui.rowData[ui.dataIndx] = '';
                            setting.keyField ?
                                ui.rowData[setting.keyField] = '' :
                                ui.rowData[setting.valueField] = '';
                        } else {
                            ui.rowData[ui.dataIndx] = item.label;
                            setting.keyField ?
                                ui.rowData[setting.keyField] = item.id :
                                ui.rowData[setting.valueField] = item.id;
                        }

                        if (typeof autoCompleteObj.select === 'function') {
                            const { rowData } = ui;
                            /* const cellData = {};
                            $.extend(cellData, ui); */
                            const cellData = { ...ui };
                            cellData.selected = item;
                            delete cellData.rowData;
                            return autoCompleteObj.select(rowData, cellData, setting);
                        }
                    };

                    setting.change = function (evt, item3) {
                        const { item } = item3;

                        if (!item) {
                            ui.rowData[ui.dataIndx] = '';
                            setting.keyField ?
                                ui.rowData[setting.keyField] = '' :
                                ui.rowData[setting.valueField] = '';
                        } else {
                            ui.rowData[ui.dataIndx] = item.label;
                            setting.keyField ?
                                ui.rowData[setting.keyField] = item.id :
                                ui.rowData[setting.valueField] = item.id;
                        }
                        if (typeof autoCompleteObj.change === 'function') {
                            const { rowData } = ui;
                            /* const cellData = {};
                            $.extend(cellData, ui); */
                            const cellData = { ...ui };
                            cellData.selected = item;
                            delete cellData.rowData;
                            return autoCompleteObj.change(rowData, cellData, setting);
                        }
                    };

                    if (typeof setting.focus === 'function') {
                        const { rowData } = ui;
                        /* const cellData = {};
                        $.extend(cellData, ui); */
                        const cellData = { ...ui };
                        delete cellData.rowData;
                        setting.focus = function (evt, item) {
                            cellData.selected = item;
                            return autoCompleteObj.focus(rowData, cellData, setting);
                        };
                    }

                    if (typeof setting.close === 'function') {
                        const { rowData } = ui;
                        /* const cellData = {};
                        $.extend(cellData, ui); */
                        const cellData = { ...ui };
                        delete cellData.rowData;
                        setting.close = function (evt, item) {
                            cellData.selected = item;
                            return autoCompleteObj.close(rowData, cellData, setting);
                        };
                    }

                    if (typeof setting.create === 'function') {
                        const { rowData } = ui;
                        /* const cellData = {};
                        $.extend(cellData, ui); */
                        const cellData = { ...ui };
                        delete cellData.rowData;
                        setting.create = (evt, item) => {
                            cellData.selected = item;
                            return autoCompleteObj.create(rowData, cellData, setting);
                        };
                    }

                    const $inp = ui.$cell.find('input');
                    // initialize the editor
                    $inp.autocomplete(setting).focus(function () {
                        // open the autocomplete upon focus
                        $(this).autocomplete('search', '');
                    });
                };
            }

            const result = obj.columns.map((item) => {
                item.title = item.display;
                item.dataIndx = item.name;
                // item.hidden = item.isAllowHide;
                item.sortable = item.isSort;
                // item.editable = item.isEdit;
                if (item.editor) {
                    const eidtorObj = item.editor;
                    if (eidtorObj.type === 'select') { //  编辑框为下拉框, 日期框，表格时
                        eidtorObj.init = autoCompleteEditor(eidtorObj);
                    } else if (eidtorObj.type === 'date') {
                        eidtorObj.init = dateEditor(eidtorObj);
                    } else if (eidtorObj.type === 'grid') {
                        eidtorObj.init = gridEditor(eidtorObj);
                    } else {
                        let prvValue;
                        let prvRowData;
                        // 在init中拿取先前值，先前行数据
                        eidtorObj.init = (ui) => {
                            prvValue = ui.cellData;
                            prvRowData = ui.rowData;
                        };
                        eidtorObj.getData = (ui) => {
                            const { $cell } = ui;
                            const curValue = $cell.find('input').val();
                            // const curRowData = $.extend({}, prvRowData);
                            const curRowData = { ...prvRowData };
                            curRowData[ui.dataIndx] = curValue;
                            // 判断是否改变值，来放置钩子
                            if (prvValue !== curValue) {
                                const curCellMsg = ui;
                                curCellMsg.currentValue = curValue;
                                curCellMsg.previousValue = prvValue;
                                if (typeof eidtorObj.change === 'function') {
                                    // 用异步来解决还获取不到表格数据的问题 update.wsj.2017.9.8
                                    setTimeout(() => {
                                        eidtorObj.change(curRowData, curCellMsg);
                                    }, 100);
                                }
                            }
                            return curValue;
                        };
                    }
                    eidtorObj.type = 'textbox'; // 给PGgrid传值type为'textbox'
                }
                if (item.columns) {
                    item.colModel = filterColumn(item);
                }
                delete item.display;
                delete item.name;
                delete item.isAllowHide;
                delete item.isSort;
                if (item.totalSummary) {
                    item.summary = {};
                    item.summary.title = item.totalSummary.display;
                    delete item.totalSummary;
                }
                return item;
            });
            delete obj.columns;
            return result;
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


        /**
         * @description 计算指定列的合计数据
         * @param {array} columns 列名
         * @returns 合计数据的对象
         */
        function _getTotalSummary(columns) {
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
        function _getAverageSummary(cols) {
            const totals = _getTotalSummary(cols);
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
        function _getMaxAndMinSummary(cols, type) {
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
        function _fillSummaryData() {
            const summaryRows = [];
            const keyWord = opts.summary.keyWordCol; // 获取关键字所在列的列名
            const optSummary = opts.summary;
            if (!keyWord) {
                alert('请输入关键字所在列的列名');
                return false;
            }
            if (optSummary.totalColumns instanceof Array && optSummary.totalColumns.length) {
                const total = _getTotalSummary(optSummary.totalColumns);
                total[keyWord] = '<b>合计:</b>';
                total.pq_rowcls = 'green';
                summaryRows.push(total);
            }
            if (optSummary.averageColumns instanceof Array && optSummary.averageColumns.length) {
                const average = _getAverageSummary(optSummary.averageColumns);
                average[keyWord] = '<b>平均值:</b>';
                average.pq_rowcls = 'yellow';
                summaryRows.push(average);
            }
            if (optSummary.maxColumns instanceof Array && optSummary.maxColumns.length) {
                const maxData = _getMaxAndMinSummary(optSummary.maxColumns, 'max');
                maxData[keyWord] = '<b>最大值:</b>';
                summaryRows.push(maxData);
            }
            if (optSummary.minColumns instanceof Array && optSummary.minColumns.length) {
                const minData = _getMaxAndMinSummary(optSummary.minColumns, 'min');
                minData[keyWord] = '<b>最小值:</b>';
                summaryRows.push(minData);
            }
            return summaryRows;
        }
        /**
         * @description  内部生成生成合计行的函数
        */
        let $summary;
        let summaryRows = []; //   摘要合计行节点、 摘要行数据   (全局变量)
        function createSummaryRows() {
            opts.render = function (event, ui) {
                // 生成合计行的节点 储存到$summary里
                $summary = $('<div class="pq-grid-summary"></div>')
                    .prependTo($('.pq-grid-bottom', this));
                if (opts.summary) {
                    summaryRows = _fillSummaryData();
                }
                if (typeof options.render === 'function') {
                    options.render(event, ui);
                }
            };
            if (opts.summary) {
                opts.cellBeforeSave = function (evt, ui) {
                    let cd = ui.newVal;
                    const col = ui.dataIndx;
                    const smyArr = opts.summary;
                    // 当编辑格 所在列名在 summary的数组中 执行下面 判断
                    if (col !== smyArr.keyWordCol && new RegExp(col).test(JSON.stringify(smyArr))) {
                        if (cd === '') {
                            cd = 0;
                        }
                    }
                    if (typeof options.cellBeforeSave === 'function') {
                        options.cellBeforeSave(evt, ui);
                    }
                };
                opts.cellSave = function (evt, ui) {
                    summaryRows = _fillSummaryData();
                    opts.refresh.call(this);
                    if (typeof options.cellSave === 'function') {
                        options.cellSave(evt, ui);
                    }
                };
            }
            /**
             * @description 远程请求数据中包含合计数据时 渲染合计行
             * @returns
             */
            if (opts.summaryRowIndx) {
                opts.dataModel.getData = function (response, textStatus, jqXHR) {
                    const data = response.Rows;
                    summaryRows = [];
                    if (!data) {
                        return false;
                    }
                    // 过滤出放在底部冻结行(合计行)的数据
                    for (let i = 0; i < opts.summaryRowIndx; i++) {
                        const Indx = opts.summaryRowIndx[i];
                        if (typeof Indx !== 'number') {
                            alert('请填写正确的行索引值');
                            return false;
                        }
                        summaryRows.push(data[Indx]);
                        data.splice(Indx, 1);
                    }
                    response.data = data;

                    if (typeof options.dataModel.getData === 'function') {
                        return options.dataModel.getData(response, textStatus, jqXHR);
                    } else {
                        return response;
                    }
                };
            }
            opts.refresh = function (event, ui) {
                // summaryRows = _fillSummaryData();
                // if (ui.dataModel.data) {
                $(this).pqGrid('createTable', {
                    $cont: $summary,
                    data: summaryRows

                });
                // }
                if (typeof options.refresh === 'function') {
                    options.refresh(event, ui);
                }
            };
        }
        opts.colModel = filterColumn(opts);
        if (opts.checkbox) {
            createCheckBoxColumn(opts);
            if (opts.freezeCols) {
                opts.freezeCols += 1;
            } else {
                opts.freezeCols = 1;
            }
        }
        if (!opts.usePager) {
            opts.pageModel.type = null;
        }
        //  显示固定在表格底部的合计、平均值、最大值、最小值 的行集合 参数
        /* eg：
             summary:{         //  摘要行集合 对象
                 totalColumns:['revenues','profits'],
                 keyWordCol:'rank',   //关键字所在列的列名
                 averageColumns:['revenues','profits'],
                 maxColumns:['revenues','profits'],
                 minColumns:['revenues','profits']
         } */

        if (opts.summaryRowIndx instanceof Array && opts.summaryRowIndx.length) {
            createSummaryRows();
        } else if (opts.summary) {
            createSummaryRows();
        }

        /**
         * hover单元格显示title 。
         * 可以是boolean，
         * 也可以是function，需要返回对象，key是列name，值是显示的title
         */
        if (opts.hoverShowTitle) {
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

        const grid = $self.pqGrid(opts);
        const methods = {
            /**
             * 自定义绑定事件
             * @param {[string]}   eventname [**事件名] click、mousedown...
             * @param {Function} callback  [**回调函数]
             */
            setEvent(eventname, callback) {
                if (typeof eventname === 'string' && typeof callback === 'function') {
                    $self.on(eventname, callback);
                }
            },
            /**
             * 给行添加class
             * @param  {number} rowIndx [**行索引]
             * @param  {String} cls     [**判断的class]
             */
            addRowClass(rowIndx, cls) {
                grid.pqGrid('addClass', {
                    rowIndx: rowIndx,
                    cls: cls
                });
            },
            /**
             * 给单元格添加class
             * @param  {number} rowIndx [**行索引]
             * @param  {Number/String} dataIndx [**键名或数组索引]
             * @param  {String} cls     [**判断的class]
             */
            addCellClass(rowIndx, dataIndx, cls) {
                grid.pqGrid('addClass', {
                    rowIndx: rowIndx,
                    dataIndx: dataIndx,
                    cls: cls
                });
            },
            /**
             * 末尾添加数据行。
             * @param {object} obj      [行数据对象]
             */
            addRow(obj) {
                obj = obj || {};

                grid.pqGrid('addRow', {
                    rowData: obj
                });
            },
            /**
             * 选定行，插入数据行。
             * @param  {number} rowIndx [行号]
             * @param  {object} obj     [行数据对象]
             */
            insertRow(rowIndx, obj) {
                grid.pqGrid('addRow', {
                    rowData: obj,
                    rowIndx: rowIndx
                });
            },
            /**
             * 折叠grid ！
             */
            // collapse: function () {
            //     grid.pqGrid('collapse');
            // },

            /**
             * 限制 添加提交删除操作 ！
             * @param  {[string]} type ['add、update、']
             * @param  {array} rows [ rows: 服务端获取}]
             */
            commit(type, rows) {
                if (type && rows) {
                    grid.pqGrid('commit', {
                        type: type,
                        rows: rows
                    });
                } else {
                    grid.pqGrid('commit');
                }
            },
            /**
             * 生成类似结构，同步的表
             * @param  {object} obj [**键入{$cont: $('<div></div>'), data: [对应clomun的数据结构或数组]}]
             */
            createTable($cont, data) {
                grid.pqGrid('createTable', {
                    $cont: $cont,
                    data: data
                });
            },
            /**
             * 删除行
             * @param  {object} obj [**rowIndx: 行索引]
             */
            deleteRow(rowIndx) {
                grid.pqGrid('deleteRow', {
                    rowIndx: rowIndx
                });
            },
            /**
             * 删除选中行
             */
            deleteSelectedRow() {
                const selectedRow = grid.pqGrid('selection', {
                    method: 'getSelection',
                    type: 'row'
                });

                selectedRow.forEach((item) => {
                    grid.pqGrid('deleteRow', {
                        rowIndx: item.rowIndx
                    });
                });
            },
            /**
             * 销毁整个gird
             */
            destroy() {
                grid.pqGrid('destroy');
            },
            /**
             * 禁用grid
             */
            disable() {
                grid.pqGrid('disable');
            },
            /**
             * 启用grid
             */
            enable() {
                grid.pqGrid('enable');
            },
            /**
             * 选定单元格开始编辑，聚焦
             * @param  {Number} rowIndxPage  [**行索引]
             * @param  {string/number} dataIndx [**单元格的name或列索引]
             * @param  {boolean} isInAll    [如果isInAll，name在变成所有数据的行索引]
             */
            editCell(rowIndxPage, dataIndx, isInAll) {
                const paraObj = {};
                isInAll ? paraObj.rowIndx = rowIndxPage : paraObj.rowIndxPage = rowIndxPage;

                if (typeof dataIndx === 'string') {
                    paraObj.dataIndx = dataIndx;
                } else if (typeof dataIndx === 'number') {
                    paraObj.colIndx = dataIndx;
                }
                grid.pqGrid('editCell', paraObj);
            },
            /**
             * 可编辑模式下 选定行第一个单元格开始编辑
             * @param  {number} rowIndx [**行索引]
             */
            editFirstCellInRow(rowIndx) {
                grid.pqGrid('editFirstCellInRow', {
                    rowIndx: rowIndx
                });
            },
            /**
             * 展开表格 ！
             */
            // expand() {
            //     grid.pqGrid("expand");
            // },
            /**
             * 导出xml的excel格式文件 ！
             * @param  {string} url       [**导出路径]
             * @param  {string} sheetName [**文件名]
             */
            // exportExcel(url, sheetName) {
            //     grid.pqGrid("exportExcel", { url: url, sheetName: sheetName });
            // },
            /**
             * 导出csv格式
             * @param  {string} url [**导出路径]
             */
            // exportCsv(url) {
            //     grid.pqGrid("exportCsv", { url: url });
            // },
            /**
             * 过滤数据 --
             * @param  {[string]} oper [**'replace'替换原有过滤/'add'添加条件，同一个dataIndx则替换]
             * @param  {[Array]} data [**过滤数组，[键入{ dataIndx: 列索引或键名， condition: 过滤条件，value: 过滤的值，value2: 第二值 }]]
             */
            filter(oper, data) {
                grid.pqGrid('filter', {
                    oper: oper,
                    data: data
                });
            },
            /**
             * 获取单元格
             * @param  {number} rowIndx [**当前页索引]
             * @param  {number/string} dataIndx    [**单元格name，或列索引]
             * @param  {boolean} isInAll    [如果isInAll，name在变成所有数据的行索引]
             */
            getCell(rowIndx, dataIndx, isInAll) {
                const paraObj = {};

                isInAll ? paraObj.rowIndx = rowIndx : paraObj.rowIndxPage = rowIndx;

                if (typeof dataIndx === 'string') {
                    paraObj.dataIndx = dataIndx;
                } else if (typeof dataIndx === 'number') {
                    paraObj.colIndx = dataIndx;
                }
                return grid.pqGrid('getCell', paraObj);
            },
            /**
             * 根据class获取单元格 --
             * @param  {string} class [单元格class名]
             * @return {array}       [单元格对象数组]
             */
            getCellsByClass(cls) {
                return grid.pqGrid('getCellsByClass', {
                    cls: cls
                });
            },
            /**
             * 返回单元格的索引 --
             * @param  {$obj} $td [单元格jquery对象]
             */
            getCellIndices($td) {
                return grid.pqGrid('getCellIndices', {
                    $td: $td
                });
            },
            /**
             * 获取未提交的，添加，更新，删除的行。
             * @param  {String} format [不填，返回引用的rowData，填'byVal'，克隆再返回]
             * @return {[type]}     [description]
             */
            getChanges(format) {
                if (format && typeof format === 'string') {
                    return grid.pqGrid('getChanges', {
                        format: format
                    });
                } else {
                    return grid.pqGrid('getChanges');
                }
            },
            /**
             * 根据键名获取列索引
             * @param  {"string"} obj [**列name]
             * @return {number}     [列索引]
             */
            getColIndx(dataInx) {
                return grid.pqGrid('getColIndx', {
                    dataIndx: dataInx
                });
            },
            /**
             * 获取列信息
             * @param  {string} obj [**列name]
             * @return {object}     [列信息]
             */
            getColumn(dataIndx) {
                return grid.pqGrid('getColumn', {
                    dataIndx: dataIndx
                });
            },
            /**
             * 获取columns，列信息
             */
            getColumns() {
                return grid.pqGrid('getColModel');
            },
            /**
             * 根据列名数组，返回行对象数组
             * @param  {array} colNameArr [**列名数组]
             */
            getData(colNameArr) {
                return grid.pqGrid('getData', {
                    dataIndx: colNameArr
                });
            },
            /**
             * 返回当前编辑单元格 --
             */
            getEditCell() {
                return grid.pqGrid('getEditCell');
            },
            /**
             * 返回当前编辑单元格关联的数据 --
             */
            getEditCellData() {
                return grid.pqGrid('getEditCellData');
            },
            /**
             * 返回表格实例
             */
            getInstance() {
                return grid.pqGrid('getInstance').grid;
            },
            /**
             * 获取行节点
             * @param  {number} rowIndxPage [当前页行索引]
             * @return {$tr}         [行节点]
             */
            getRowNode(rowIndxPage) {
                return grid.pqGrid('getRow', {
                    rowIndxPage: rowIndxPage
                });
            },
            /**
             * 获取行数据
             * @param  {Number}  rowindx [行索引]
             * @param  {Boolean} isInAll [如果不填是，当前页的行索引。true是所有数据的索引]
             * @return {[type]}          [description]
             */
            getRowData(rowindx, isInAll) {
                const paraObj = {};

                isInAll ? paraObj.rowIndx = rowindx : paraObj.rowIndxPage = rowindx;

                return grid.pqGrid('getRowData', paraObj);
            },
            /**
             * 返回行索引
             * @param  {jq object} obj [jquery对象]
             * @return {Number}     [索引值]
             */
            getRowIndx($tr) {
                return grid.pqGrid('getRowIndx', {
                    $tr: $tr
                });
            },
            /**
             * 返回行数据对象数组
             * @param  {String} obj [行class]
             */
            getRowsByClass(cls) {
                return grid.pqGrid('getRowsByClass', {
                    cls: cls
                });
            },
            /**
             * 翻页，跳转指定页面
             * @param  {Number} obj [指定页数]
             */
            goToPage(pageNum) {
                grid.pqGrid('goToPage', {
                    page: pageNum
                });
            },
            /**
             * 判断行有没有对应class
             * @param  {number} rowIndx [行索引]
             * @param  {String} cls     [判断的class]
             */
            hasRowClass(rowIndx, cls) {
                return grid.pqGrid('hasClass', {
                    rowIndx: rowIndx,
                    cls: cls
                });
            },
            /**
             * 判断单元格有没有class
             * @param  {number} rowIndx [行索引]
             * @param  {Number/String} dataIndx [键名或数组索引]
             * @param  {String} cls     [判断的class]
             */
            hasCellClass(rowIndx, dataIndx, cls) {
                return grid.pqGrid('hasClass', {
                    rowIndx: rowIndx,
                    dataIndx: dataIndx,
                    cls: cls
                });
            },
            /**
             * 隐藏加载图表
             */
            hideLoading() {
                grid.pqGrid('hideLoading');
            },
            /**
             * 操作历史记录
             * @param  {String} obj [undo：反向添加更新删除, redo：重复添加更新删除先前反转的操作, canUndo：返回布尔值，是否可以执行进一步的撤销操作, canRedo：返回布尔值，是否可以重复执行操作, reset：清楚历史记录，不进行任何操作]
             * @return {[type]}     [description]
             */
            history(method) {
                if (method === 'canUndo' || method === 'canRedo') {
                    return grid.pqGrid('history', {
                        method: method
                    });
                } else {
                    grid.pqGrid('history', {
                        method: method
                    });
                }
            },
            /**
             * 判断提交后数据是否有变化
             * @param  {Srtng/number/""}  rowData [不填查所有。或填入行索引或行数据逐行查询]
             * @return {Boolean}         [description]
             */
            isDirty(rowData) {
                if (rowData) {
                    const paraObj = {};
                    if (typeof rowData === 'number') {
                        paraObj.rowIndx = rowData;
                    } else if (typeof rowData === 'string') {
                        paraObj.rowData = rowData;
                    }
                    return grid.pqGrid('isDirty', paraObj);
                } else {
                    return grid.pqGrid('isDirty');
                }
            },
            /**
             * 判断是否可编辑
             * @param  {Number}  rowIndx  [行索引]
             * @param  {Number/String}  dataIndx [数据数组索引，或键名]
             * @return {Boolean}          [description]
             */
            isEditableCell(rowIndx, dataIndx) {
                return grid.pqGrid('isEditableCell', {
                    rowIndx: rowIndx,
                    dataIndx: dataIndx
                });
            },
            /**
             * 判断行是否可编辑
             * @param  {Number}  rowIndx [行索引]
             */
            isEditableRow(rowIndx) {
                return grid.pqGrid('isEditableRow', {
                    rowIndx: rowIndx
                });
            },
            /**
             * 检查行是否对column.validations []有效
             * @param  {number/obj/arry}  obj [行信息]
             * @param  {Boolean}  allowInvalid [为true是允许无效，返回无效集合 false，不允许无效，跳到第一个无效单元格，返回第一个单元格无效信息]
             */
            isRowValid(rowIndx, allowInvalid) {
                if (typeof rowIndx === 'number') {
                    return grid.pqGrid('isValid', {
                        rowIndx: rowIndx,
                        allowInvalid: allowInvalid
                    });
                } else if (typeof rowIndx === 'object') {
                    return grid.pqGrid('isValid', {
                        rowData: rowIndx,
                        allowInvalid: allowInvalid
                    });
                }
            },
            /**
             * 检查行集合是否对column.validations []有效
             * @param  {arry}  obj [行信息集合]
             * @param  {Boolean}  allowInvalid []
             */
            isRowArrayValid(data, allowInvalid) {
                return grid.pqGrid('isValid', {
                    data: data,
                    allowInvalid: allowInvalid
                });
            },
            /**
             * 检查单元格是否对column.validations []有效
             * @param  {number}  obj [行索引]
             * @param  {number、string}  obj [列name或数据索引]
             * @param  {Boolean}  allowInvalid []
             */
            isCellValid(rowIndx, dataIndx, allowInvalid) {
                return grid.pqGrid('isValid', {
                    rowIndx: rowIndx,
                    dataIndx: dataIndx,
                    allowInvalid: allowInvalid
                });
            },
            /**
             * 忽略编辑单元格未保存的更改，并退出编辑模式
             */
            quitEditMode() {
                grid.pqGrid('quitEditMode');
            },
            /**
             * 返回表格的设置选项
             * @param  {string/object/} optionName [不填：值返回当前grid设置对象，object：{optionName: value},增加设置]
             * @param  {  } value      [上个参数为string时，不填：返回对应设置的值。填：修改对应设置]
             */
            option(optionName, value) {
                if (optionName) {
                    if (typeof optionName === 'string') {
                        if (value) {
                            if (optionName === 'columns') {
                                optionName = 'colModel';
                                value.forEach((item) => {
                                    if (item.display) {
                                        item.title = item.display;
                                        delete item.display;
                                    }
                                    if (item.name) {
                                        item.dataIndx = item.name;
                                        delete item.name;
                                    }
                                    if (item.isSort) {
                                        item.sortable = item.isSort;
                                        delete item.isSort;
                                    }
                                });
                                if (opts.checkbox) {
                                    value.unshift({
                                        title: '',
                                        dataIndx: 'et_checkBox',
                                        width: 30,
                                        minWidth: 30,
                                        align: 'center',
                                        type: 'checkBoxSelection',
                                        cls: 'ui-state-default',
                                        resizable: false,
                                        editable: false,
                                        sortable: false
                                    });
                                }
                            }
                            grid.pqGrid('option', optionName, value);
                        } else {
                            return grid.pqGrid('option', optionName);
                        }
                        return grid.pqGrid('option');
                    } else if (typeof optionName === 'object') {
                        grid.pqGrid('option', optionName);
                    }
                } else {
                    return grid.pqGrid('option');
                }
            },
            /**
             * 刷新，更改dataModel，或更新记录时很有用
             * @return {[type]} [description]
             */
            refresh() {
                grid.pqGrid('refresh');
            },
            /**
             * 刷新单元格
             * @param  {Number} rowIndx  [当前页面索引]
             * @param  {Number，String} dataIndx [数据索引，或键名]
             * @param  {Boolean} isInAll  [为true时，所有数据索引]
             */
            refreshCell(rowIndx, dataIndx, isInAll) {
                const paraObj = {
                    dataIndx: dataIndx
                };
                isInAll ? paraObj.rowIndx = rowIndx : paraObj.rowIndxPage = rowIndx;
                grid.pqGrid('refreshCell', paraObj);
            },
            /**
             * 刷新列
             * @param  {Number/string} dataIndx [数据索引，或键名]
             */
            refreshColumn(dataIndx) {
                grid.pqGrid('refreshColumn', {
                    dataIndx: dataIndx
                });
            },
            /**
             * 刷新数据，也会重新加载后台数据。更改dataModal属性，或添加，删除更新记录后很有用。避免循环
             */
            refreshDataAndView() {
                grid.pqGrid('refreshDataAndView');
            },
            /**
             * 刷新列标题
             */
            refreshHeader() {
                grid.pqGrid('refreshHeader');
            },
            /**
             * 刷新行
             * @param  {Number} rowIndx [当前页行索引]
             * @param  {boolean} isInAll [填入并true时，所有数据行索引]
             */
            refreshRow(rowIndx, isInAll) {
                const paraObj = {};

                isInAll ? paraObj.rowIndx = rowIndx : paraObj.rowIndxPage = rowIndx;
                grid.pqGrid('refreshRow', rowIndx);
            },
            /**
             * 刷新视图。更改dataModel或添加，删除，更新记录后很有用
             */
            refreshView() {
                grid.pqGrid('refreshView');
            },
            /**
             * 移除行class
             * @param  {number} rowIndx [**行索引]
             * @param  {String} cls     [**删除的class，可以空格分割来删除多个class]
             */
            removeRowClass(rowIndx, cls) {
                grid.pqGrid('removeClass', {
                    rowIndx: rowIndx,
                    cls: cls
                });
            },
            /**
             * 移除单元格class
             * @param  {number} rowIndx [**行索引]
             * @param  {Number/String} dataIndx [**键名或数组索引]
             */
            removeCellClass(rowIndx, dataIndx, cls) {
                grid.pqGrid('removeClass', {
                    rowIndx: rowIndx,
                    dataIndx: dataIndx,
                    cls: cls
                });
            },
            /**
             * 打开跟踪后，可以撤销添加，编辑，删除操作
             * @param  {string} type [撤销类型，"add", "update", "dalete"]
             */
            rollback(type) {
                grid.pqGrid('rollback', {
                    type: type
                });
            },
            /**
             * 折叠对应视图
             * @param  {Number} rowIndx [当前页行索引]
             * @param  {Boolean} isInAll [填入并true时，所有数据行索引]
             */
            rowCollapse(rowIndx, isInAll) {
                const paraObj = {};
                isInAll ? paraObj.rowIndx = rowIndx : paraObj.rowIndxPage = rowIndx;
                grid.pqGrid('rowCollapse', paraObj);
            },
            /**
             * 展开对应视图
             * @param  {Number} rowIndx [当前页行索引]
             * @param  {Boolean} isInAll [填入并true时，所有数据行索引]
             */
            rowExpand(rowIndx, isInAll) {
                const paraObj = {};

                isInAll ? paraObj.rowIndx = rowIndx : paraObj.rowIndxPage = rowIndx;
                grid.pqGrid('rowExpand', paraObj);
            },
            /**
             * 从视图和缓存中删除该行的详细视图 ！网络错误导致视图无法加载可能有用
             * @param  {Number} rowIndx [当前页行索引]
             * @param  {Boolean} isInAll [填入并true时，所有数据行索引]
             */
            // rowInvalidate(rowIndx, isInAll) {
            //     var paraObj = {};

            //     isInAll ? paraObj.rowIndx = rowIndx : paraObj.rowIndxPage = rowIndx;
            //     grid.pqGrid("rowInvalidate", paraObj);
            // },
            /**
             * 保存当前编辑单元格
             * @return {[type]} [description]
             */
            saveEditCell() {
                return grid.pqGrid('saveEditCell');
            },
            /**
             * 水平滚动视图
             * @param  {Number/string} dataIndx [列名name或数据数组索引]
             */
            scrollColumn(dataIndx) {
                grid.pqGrid('scrollColumn', {
                    dataIndx: dataIndx
                });
            },
            /**
             * 垂直滚动视图
             * @param  {Number} rowIndxPage [当前页行索引]
             */
            scrollRow(rowIndxPage) {
                grid.pqGrid('scrollRow', {
                    rowIndxPage: rowIndxPage
                });
            },
            /**
             * 针对选择状态的操作，
             */
            selection(obj) {
                if (obj && typeof obj === 'object') {
                    if (obj.method === 'indexOf' || obj.method === 'getSelection') {
                        return grid.pqGrid('selection', obj);
                    } else {
                        grid.pqGrid('selection', obj);
                    }
                }
            },
            /**
             * selection中抽离，从选择集中移除指定行数据
             */
            selectRemove(rowIndx) {
                grid.pqGrid('selection', {
                    method: 'remove',
                    type: 'row',
                    rowIndx: rowIndx
                });
            },
            /**
             * selection中抽离，删除所有选择数据
             */
            selectRemoveAll() {
                grid.pqGrid('selection', {
                    method: 'removeAll',
                    type: 'row'
                });
            },
            /**
             * selection中抽离，从选择集中添加指定行数据
             */
            selectAdd(rowIndx, dataIndx) {
                if (dataIndx) {
                    grid.pqGrid('selection', {
                        method: 'add',
                        type: 'cell',
                        rowIndx: rowIndx,
                        dataIndx: dataIndx
                    });
                } else {
                    grid.pqGrid('selection', {
                        method: 'add',
                        type: 'row',
                        rowIndx: rowIndx
                    });
                }
            },
            /**
             * selection中抽离，获取选择数据集
             * @param  {string} type ["row"、 "cell"]
             */
            selectGet(type) {
                type = type || 'row';

                return grid.pqGrid('selection', {
                    method: 'getSelection',
                    type: type
                });
            },
            /**
             * selection中抽离，复选框问题时使用，获取选择数据
             */
            selectGetChecked() {
                let selection = grid.pqGrid('selection', {
                    method: 'getSelection',
                    type: 'row'
                });
                selection = selection.filter(item => !item.rowData.disabledcheckbox);
                return selection;
            },
            /**
             * 根据参数选择行、单元格
             * @param {Number} rowIndx [当前页行索引]
             * @param {Boolean} focus [是否聚焦必填]
             * @param {boolean} isInAll [true时，所有数据行索引。]
             */
            setSelection(rowIndx, focus, isInAll) {
                let paraObj = {};

                if (rowIndx === null) {
                    paraObj = null;
                } else {
                    focus ? paraObj.focus = true : paraObj.focus = false;
                    isInAll ? paraObj.rowIndx = rowIndx : paraObj.rowIndxPage = rowIndx;
                }

                grid.pqGrid('setSelection', paraObj);
            },
            /**
             * 显示loading。异步操作时很有用
             */
            showLoading() {
                grid.pqGrid('showLoading');
            },
            /**
             * 撤销添加，更新，删除操作。可以被多次调用 ！
             * @return {[type]} [description]
             */
            undo() {
                grid.pqGrid('undo');
            },
            /**
             * 更新行数据
             * @param  {number} rowIndx [行索引]
             * @param  {object} rowdata [行数据]
             */
            updateRow(rowIndx, rowdata) {
                grid.pqGrid('updateRow', {
                    rowIndx: rowIndx,
                    row: rowdata
                });
            },
            /**
             * 返回包含表格的jquery对象
             * @return {[type]} [description]
             */
            widget() {
                return grid.pqGrid('widget');
            },

            // ///////////////////////////////////////////////////////////////////
            //                        自定义方法                                 //
            // ///////////////////////////////////////////////////////////////////

            /**
             * 重新加载数据  URL默认值为初始化时的URL
             * @param  {obj} parms [ajax 参数]
             * @param  {string} url   [ajax url]
             */
            loadData(parms, url) {
                url = url || grid.pqGrid('option', 'dataModel.url');
                let onoff = true;
                parms.push({ // 兼容之前ligergrid 后台向前台 传的changepage字段
                    name: 'changepage',
                    value: 1
                });
                grid.pqGrid('option', 'dataModel.getUrl', () => {
                    let parms2 = parms.slice();
                    if (opts.pageModel.type === 'remote') {
                        let page = grid.pqGrid('option', 'pageModel').curPage;
                        const pagesize = grid.pqGrid('option', 'pageModel').rPP;
                        if (onoff) {
                            page = 1;
                            onoff = false; // 点击页面分页按钮时 禁止它始终加载第一页的数据
                        }
                        parms2.push({
                            name: 'page',
                            value: page
                        });

                        parms2.push({
                            name: 'pagesize',
                            value: pagesize
                        });
                    } else {
                        parms2 = parms;
                    }
                    return {
                        url: url,
                        data: parms2
                    };
                });
                grid.pqGrid('option', 'pageModel.curPage', 1);
                grid.pqGrid('refreshDataAndView');
            },
            /**
             * @description 批量删除行数据
             * @param {any} arrs  [{rowIndx:..,....},{.....}]
             */
            deleteRows(arrs) {
                if (!(arrs instanceof Array)) {
                    return false;
                }
                const Gobj = $grid.getInstance();
                for (let i = 0, lgth = arrs.length; i < lgth; i++) {
                    const objP = arrs[i];
                    const { rowIndxPage } = objP;
                    const offset = Gobj.rowIndxOffset;
                    const rowIndx = (rowIndxPage != null) ? rowIndxPage + offset : objP.rowIndx;
                    if (rowIndx != null) {
                        const rowData = objP.rowData || Gobj.getRowData({
                            rowIndx: rowIndx
                        });
                        Gobj._digestData({
                            source: objP.source || 'delete',
                            history: objP.history,
                            track: objP.track,
                            rowList: [{
                                rowIndx: rowIndx,
                                rowData: rowData,
                                oldRow: rowData,
                                type: 'delete'
                            }]
                        });
                    }
                }
                Gobj.refreshView();
            },
            /**
             * @description 添加多行
             * @param {any} rowdataArr
             */
            addRows(rowdataArr) {
                $(rowdataArr).each(function () {
                    $grid.addRow(this);
                });
            },
            /**
             * @description 获取远程请求时的字段 parms
             * @returns  parms对象
             */
            getUrlParms() {
                return $grid.option('dataModel').getUrl().data;
            },
            /**
             * 获取所有数据
             */
            getAllData() {
                return grid.pqGrid('option', 'dataModel.data');
            },
            /**
             * 获取当前页数据
             */
            getDataInPage() {
                const inStance = grid.pqGrid('getInstance').grid;
                return inStance.data;
            },
            /**
             * 显示隐藏列
             * @param  {string}  columnname [列名]
             * @param  {Boolean} isShow     [是否显示]
             */
            toggleCol(columnname, isShow) {
                const colIndex = grid.pqGrid('getColIndx', {
                    dataIndx: columnname
                });
                const colM = grid.pqGrid('option', 'colModel');
                colM[colIndex].hidden = isShow;
                grid.pqGrid('option', 'colModel', colM);
            },
            /**
             * @description  设置toobar 按钮置灰
             * @param {any} itemid button中 item.id值
             */
            setDisabledTB(itemid) {
                const inStance = grid.pqGrid('getInstance').grid;
                inStance.$toolbar.pqToolbar('setDisabled', itemid);
            },
            /**
             * @description   获取修改数据
             * @returns 返回数组集合
             */
            getUpdated() {
                const inStance = grid.pqGrid('getInstance').grid;
                return inStance.iUCData.udata;
            },
            /**
             * @description 获取添加数据
             * @returns 返回数组集合
             */
            getAdded() {
                const inStance = grid.pqGrid('getInstance').grid;
                return inStance.iUCData.adata;
            },
            /**
             * @description 获取删除数据
             * @returns 返回数组集合
             */
            getDeleted() {
                const inStance = grid.pqGrid('getInstance').grid;
                return inStance.iUCData.ddata;
            },
            /**
             * @description 刷新摘要(合计)行
             */
            refreshSummary() {
                summaryRows = _fillSummaryData();
                grid.pqGrid('createTable', {
                    $cont: $summary,
                    data: summaryRows

                });
            },
            /**
             * @description 获取摘要摘要行数据
             * @returns
             */
            getSummaryDatas() {
                return _fillSummaryData();
            },
            /**
             * @description 获取合计行数据
             * @param {any} 'strings' or array
             * @returns
             */
            getTotalSummary(columns) {
                if (typeof columns === 'string') {
                    const theColumn = [columns];

                    const totalValue = _getTotalSummary(theColumn);

                    return totalValue[columns];
                } else {
                    return _getTotalSummary(columns);
                }
            },
            /**
             * @description 获取表格打印格式的表头列
             * @returns
             */
            getPrintColumns() {
                let [colIndx, maxlevel] = [0, 1];
                function _printColsFilter(obj) {
                    obj = $.extend(true, {}, obj);
                    let leafIndex;
                    if (obj.level) { // obj 是或否为表头子节点
                        leafIndex = obj.level + 1;
                        maxlevel = maxlevel < leafIndex ? leafIndex : maxlevel;
                    }

                    let result = obj.colModel.map((item) => {
                        item.display = item.title;
                        item.name = item.dataIndx;
                        item.type = item.dataType || 'string';
                        item.isSort = item.sortable || false;
                        item.columnindex = colIndx;

                        if (item.name === 'et_checkBox' || item.hidden || (!item.colModel && item.name === undefined)) { // 隐藏列与复选框 过滤掉
                            return false;
                        }

                        if (leafIndex === undefined) {
                            item.level = 1;
                        } else {
                            item.level = leafIndex;
                        }

                        if (item.colModel && item.colModel.length) {
                            item.columns = _printColsFilter(item);
                            delete item.colModel;
                        } else {
                            colIndx++;
                        }
                        if (item.name === undefined) {
                            delete item.name;
                        }

                        const fKeys = ['name', 'display', 'type', 'align', 'width', 'colSpan', 'rowSpan', 'formatter', 'columnindex', 'level', 'columns', 'reg'];
                        Object.keys(item).forEach((key) => { // 删除其他不必要的属性
                            if (!fKeys.some(item2 => item2 === key)) {
                                delete item[key];
                            } else if (item[key] === 1 && (key === 'rowSpan' || key === 'colSpan')) { // 删除rowSpan、colSpan属性值为1
                                delete item[key];
                            }
                        });
                        return item;
                    });
                    result = result.filter(item => item);

                    return result;
                }
                const Obj = $grid.option();
                const cols = _printColsFilter(Obj);
                const results = {
                    maxcolumnindex: colIndx - 1,
                    maxlevel: maxlevel,
                    rows: cols
                };
                return results;
            },
            /**
             * @description 根据列层次获取列集合
             * @param {any} columnLevel number类型
             * @returns
             */
            getColsByLevel(columnLevel) {
                const result = [];
                let cols = $grid.getPrintColumns();
                if (columnLevel === undefined) {
                    cols = $grid.getColumns();
                    return cols;
                }
                function filterCols(cols2) {
                    for (let i = 0, lgh = cols2.length; i < lgh; i++) {
                        const col = cols2[i];
                        if (col.level === columnLevel) {
                            result.push(col);
                        } else if (col.columns && col.columns.length) {
                            filterCols(col.columns);
                        }
                    }
                }
                filterCols(cols);

                return result;
            }
            /**
             * 数据加载完成后事件
             * @param  {function} fn 回调函数function (event, ui) {}
             */
            // success: function (fn) {
            //     grid.pqGrid("pqgridload", fn);
            // }
        };
        $grid = $.extend({}, grid, methods);
        
        /*  inStance.$grid_inner.on('') */
        export {grid, $self, opts, $grid, $summary, summaryRows, _fillSummaryData, _getTotalSummary}; 
        return $grid;
    };
}(jQuery));