import { replaceOption, fillSummaryData, getTotalSummary } from './privateMethods';

function Methods(grid) {
    const methods = {
        /**
         * 自定义绑定事件
         * @param {[string]}   eventname [**事件名] click、mousedown...
         * @param {Function} callback  [**回调函数]
         */
        setEvent(eventname, callback) {
            if (typeof eventname === 'string' && typeof callback === 'function') {
                grid.on(eventname, callback);
            }
        },
        /**
         * 给行添加class
         * @param  {number} rowIndx [**行索引]
         * @param  {String} cls     [**判断的class]
         */
        addRowClass(rowIndx, cls) {
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
            grid.pqGrid('addClass', {
                rowIndx: rowIndx,
                dataIndx: dataIndx,
                cls: cls
            });
        },
        /**
         * 末尾添加数据行。 update: 添加行可以翻滚页面至对应行，针对后台分页增加代码 simon 2018/2/6
         * @param {object} obj      [行数据对象]
         * @param {bool} isFlip [添加行后，是否自动翻到添加数据的行]
         */
        addRow(obj = {}, isFlip = true) {
            const gridData = grid.pqGrid('option').dataModel.data;
            const rowLength = gridData ? gridData.length : 0;
            // 这里的rowIndex计算可能会用问题，还需要测试看看
            const rowIndx = rowLength;
            const { curPage, totalPages, rPP } = grid.pqGrid('option').pageModel;
            const rowIndxPage = rowIndx % rPP;

            // 后台分页时的处理
            if (grid.pqGrid('option').pageModel.type === 'remote') {
                if (curPage < totalPages) {
                    grid.pqGrid('goToPage', { page: totalPages });
                    grid.pqGrid('option', 'cbModel.loadCbs').push({
                        func: () => {
                            grid.pqGrid('addRow', { rowData: obj });
                        },
                        isOnce: true
                    });
                } else {
                    grid.pqGrid('addRow', { rowData: obj });
                    grid.pqGrid('scrollRow', { rowIndxPage: rowIndx });

                    // 由于后台分页，这里需要再次判断之后
                    // 添加行后判断是否当页数据填满了，已经要翻页了
                    const thenCurPage = grid.pqGrid('option').pageModel.curPage;
                    const thenTotalPages = grid.pqGrid('option').pageModel.totalPages;

                    if (thenCurPage < thenTotalPages) {
                        if (!$.etDialog) {
                            console.warn('必须要引用etDialog组件！');
                            return;
                        }
                        const confirmIndex = $.etDialog.confirm(
                            '请先保存当前增加的数据，<br>否则可能丢失，是否已经保存？',
                            () => {
                                $.etDialog.close(confirmIndex);

                                grid.pqGrid('goToPage', { page: thenTotalPages });
                                grid.pqGrid('option', 'cbModel.getDataCbs').push({
                                    func: (response) => {
                                        // 这里push空对象，是为了能正确计算分页数，并增加一行
                                        response.Rows.push(obj);
                                        return response;
                                    },
                                    isOnce: true
                                });
                            },
                            () => {
                                // 取消后，删除之前增加的行
                                this.deleteRow(rPP + 1);
                            }
                        );
                    }
                }
                return;
            }

            grid.pqGrid('addRow', { rowData: obj });
            if (isFlip) {
                grid.pqGrid('goToPage', { rowIndx: rowIndx });
                grid.pqGrid('scrollRow', { rowIndxPage: rowIndxPage });
            }
        },
        /**
         * 选定行，插入数据行。 update: 添加行可以翻滚页面至对应行 simon 2017/12/06
         * @param  {number} rowIndx [行号]
         * @param  {object} obj     [行数据对象]
         * @param {bool} isFlip [添加行后，是否自动翻到添加数据的行]
         */
        insertRow(rowIndx, obj, isFlip = true) {
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
            grid.pqGrid('addRow', {
                rowData: obj,
                rowIndx: rowIndx
            });
            if (isFlip) {
                const eachPageDataLen = grid.pqGrid('option').pageModel.rPP;
                const rowIndxPage = rowIndx % eachPageDataLen;

                grid.pqGrid('goToPage', { rowIndx: rowIndx });
                grid.pqGrid('scrollRow', { rowIndxPage: rowIndxPage });
            }
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
            grid.pqGrid('deleteRow', {
                rowIndx: rowIndx
            });
        },
        /**
         * 删除选中行
         */
        deleteSelectedRows() {
            const selectedRow = grid.pqGrid('selection', {
                method: 'getSelection',
                type: 'row'
            });
            this.deleteRows(selectedRow);
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
            typeof rowIndxPage === 'string' ? rowIndxPage *= 1 : rowIndxPage;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            }
            return grid.pqGrid('getChanges');
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
            typeof rowIndxPage === 'string' ? rowIndxPage *= 1 : rowIndxPage;
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
            typeof rowindx === 'string' ? rowindx *= 1 : rowindx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            }
            grid.pqGrid('history', {
                method: method
            });
            return false;
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
            }
            return grid.pqGrid('isDirty');
        },
        /**
         * 判断是否可编辑
         * @param  {Number}  rowIndx  [行索引]
         * @param  {Number/String}  dataIndx [数据数组索引，或键名]
         * @return {Boolean}          [description]
         */
        isEditableCell(rowIndx, dataIndx) {
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            return false;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            const opts = grid.pqGrid('option');
            if (typeof optionName === 'string') {
                if (value) {
                    if (optionName === 'columns') {
                        optionName = 'colModel';
                        // value.forEach((item) => {
                        //     if (item.display) {
                        //         item.title = item.display;
                        //         delete item.display;
                        //     }
                        //     if (item.name) {
                        //         item.dataIndx = item.name;
                        //         delete item.name;
                        //     }
                        //     if (item.isSort) {
                        //         item.sortable = item.isSort;
                        //         delete item.isSort;
                        //     }
                        // });
                        replaceOption({ columns: value });

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

            return grid.pqGrid('option');
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndxPage === 'string' ? rowIndxPage *= 1 : rowIndxPage;
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
                }
                grid.pqGrid('selection', obj);
            }
            return false;
        },
        /**
         * selection中抽离，从选择集中移除指定行数据
         */
        selectRemove(rowIndx) {
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
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
            typeof rowIndx === 'string' ? rowIndx *= 1 : rowIndx;
            grid.pqGrid('updateRow', {
                rowIndx: rowIndx,
                row: rowdata
            });
            if (grid.$summary) {
                this.refreshSummary();
            }
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
            const opts = grid.pqGrid('option');
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
            const Gobj = this.getInstance();
            for (let i = 0, lgth = arrs.length; i < lgth; i++) {
                const objP = arrs[i];
                const {
                    rowIndxPage
                } = objP;
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
            return false;
        },
        /**
         * @description 添加多行
         * @param {any} rowdataArr
         */
        addRows(rowdataArr) {
            rowdataArr.forEach((rowData) => {
                this.addRow(rowData);
            });
        },
        /**
         * @description 获取远程请求时的字段 parms
         * @returns  parms对象
         */
        getUrlParms() {
            return this.option('dataModel').getUrl().data;
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
         * @description 设置toobar 按钮不置灰
         * @param {any} itemid button中 item.id值
         */
        setEnabledTB(itemid) {
            const inStance = grid.pqGrid('getInstance').grid;
            inStance.$toolbar.pqToolbar('setEnabled', itemid);
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
            const opts = grid.pqGrid('option');
            grid.summaryRows = fillSummaryData(grid, opts);
            grid.pqGrid('createTable', {
                $cont: grid.$summary,
                data: grid.summaryRows
            });
        },
        /**
         * @description 获取摘要摘要行数据
         * @returns
         */
        getSummaryDatas() {
            const opts = grid.pqGrid('option');
            return fillSummaryData(opts);
        },
        /**
         * @description 获取合计行数据
         * @param {any} 'strings' or array
         * @returns
         */
        getTotalSummary(columns) {
            if (typeof columns === 'string') {
                const theColumn = [columns];

                const totalValue = getTotalSummary(grid, theColumn);

                return totalValue[columns];
            }
            return getTotalSummary(grid, columns);
        },
        /**
         * @description 获取表格打印格式的表头列
         * @returns
         */
        getPrintColumns() {
            let [colIndx, maxlevel] = [0, 1];

            function printColsFilter(obj) {
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
                        item.columns = printColsFilter(item);
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
            const Obj = grid.pqGrid('option');
            const cols = printColsFilter(Obj);
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
            let cols = this.getPrintColumns();
            if (columnLevel === undefined) {
                cols = this.getColumns();
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
        },

        addRowByDefault(rowData) {
            // 根据列信息中的is_default default_value default_text，添加行的时候附加默认值
            // 当只有is_default date默认选当天 select默认选第一个
            // 注意这里的判断，当有keyField, keyField为default_value，否则name为default_value
            const colData = this.getColumns();
            const newRowData = {};
            colData.forEach((col) => {
                const {
                    is_default,
                    default_value,
                    default_text,
                    dataIndx,
                    editor
                } = col;
                const key = editor ? editor.keyField : null;
                if (!is_default) {
                    return;
                }
                // 当传了默认值的时候
                if (default_value || default_text) {
                    if (default_value) {
                        if (key) {
                            newRowData[key] = default_value;
                        } else {
                            newRowData[dataIndx] = default_value;
                        }
                    }
                    if (default_text) {
                        newRowData[dataIndx] = default_text;
                    }

                    // 当没有传默认值
                } else {
                    switch (editor.editorType) {
                    case 'date': {
                        const now = new Date();
                        const nowYear = now.getFullYear().toString();
                        let nowMonth = now.getMonth() + 1;
                        nowMonth = nowMonth < 10 ? `0${nowMonth}` : nowMonth.toString();
                        let nowDate = now.getDate();
                        nowDate = nowDate < 10 ? `0${nowDate}` : nowDate.toString();

                        newRowData[dataIndx] = `${nowYear}-${nowMonth}-${nowDate}`;
                        break;
                    }
                    case 'select': {
                        const { source } = editor;
                        let selectId;
                        let selectText;

                        if (source) {
                            selectId = source[0].id;
                            selectText = source[0].text || source[0].label;
                        }

                        newRowData[dataIndx] = selectText;
                        newRowData[key] = selectId;
                        break;
                    }
                    default:
                        break;
                    }
                }
            });
            $.extend(newRowData, rowData);
            this.addRow(newRowData);
        },
        /**
         * 表格验证
         */
        validateTest(param = {}) {
            // , simpleTip = true
            const { required = 'all', type, test } = param;
            const rowDatas = this.getAllData();
            const colDatas = $.extend(true, [], this.getColumns());
            let isPass = true;

            // 判断是否有数据
            if (!rowDatas || rowDatas.length === 0) {
                return isPass;
            }
            // 取出选择框列
            if (colDatas[0].dataIndx === 'et_checkBox') {
                colDatas.shift();
            }

            // 类型验证 对象
            const typeValidate = {
                number: function (v) {
                    return !isNaN(Number(v)) && typeof Number(v) === 'number';
                },
                int: function (v) {
                    return typeof Number(v) === 'number' && /^(-|\+)?\d+$/.test(Number(v));
                }
            };

            // 提示信息
            const tipMsg = {
                obj: {
                    required: {},
                    type: {},
                    test: {}
                },
                keys: {
                    required: [],
                    type: [],
                    test: []
                },
                word: {
                    required: '',
                    type: '',
                    test: ''
                }
            };
            let tipText = '';

            rowDatas.forEach((rowData) => {
                colDatas.forEach((colData) => {
                    const { dataIndx, hidden } = colData;
                    const curValue = rowData[dataIndx];

                    // 过滤隐藏列
                    if (hidden) {
                        return;
                    }

                    // 当require为all， 遍历所有
                    if (required === 'all' && !curValue && curValue !== 0) {
                        isPass = false;
                        tipMsg.obj.required[dataIndx] = colData.title;
                        // console.log('必填', colData.title, isPass);

                        // 只遍历 required里有对应属性， 且为true的
                    } else if (required[dataIndx] && !curValue && curValue !== 0) {
                        isPass = false;
                        tipMsg.obj.required[dataIndx] = colData.title;
                        // console.log('必填', colData.title, isPass);
                    }

                    // 类型判断
                    if (type) {
                        const vldType = type[dataIndx];
                        // 是否有 类型判断 对应类型判断方法 判断是否正确
                        if (vldType && typeValidate[vldType] && !typeValidate[vldType](curValue)) {
                            isPass = false;
                            tipMsg.obj.type[dataIndx] = colData.title;
                            // console.log('类型', colData.title, isPass);
                        }
                    }

                    // 正则验证
                    if (test) {
                        const vldRegex = test[dataIndx];

                        if (
                            vldRegex &&
                            Object.prototype.toString.apply(vldRegex) === '[object RegExp]' &&
                            !vldRegex.test(curValue)
                        ) {
                            isPass = false;
                            tipMsg.obj.test[dataIndx] = colData.title;
                            // console.log('正则', colData.title, isPass);
                        }
                    }
                });
            });

            tipMsg.keys.required = Object.keys(tipMsg.obj.required);
            tipMsg.keys.type = Object.keys(tipMsg.obj.type);
            tipMsg.keys.test = Object.keys(tipMsg.obj.test);

            // 组成提示语
            if (tipMsg.keys.required.length !== 0) {
                tipMsg.keys.required.forEach((key) => {
                    const title = tipMsg.obj.required[key];
                    tipText += `${title}列不能为空;<br/>`;
                });

                // 判断是否有dialog弹框
                if ($.etDialog) {
                    $.etDialog.error(tipText);
                } else {
                    alert(tipText);
                }
            } else if (tipMsg.keys.type.length !== 0) {
                tipMsg.keys.type.forEach((key) => {
                    const title = tipMsg.obj.type[key];
                    tipText += `${title}列填写类型错误;<br/>`;
                });

                if ($.etDialog) {
                    $.etDialog.error(tipText);
                } else {
                    alert(tipText);
                }
            } else if (tipMsg.keys.test.length !== 0) {
                tipMsg.keys.test.forEach((key) => {
                    const title = tipMsg.obj.test[key];
                    tipText += `${title}列填写格式错误;<br/>`;
                });

                if ($.etDialog) {
                    $.etDialog.error(tipText);
                } else {
                    alert(tipText);
                }
            }
            return isPass;
        },

        /**
         * 表格数据查重
         * data为表格数据
         * repeatFields为需要查重的列name
         */
        checkRepeat(data, repeatFields) {
            const reapeatObj = {};
            const reapeatNames = [];

            if (Object.prototype.toString.call(data).toLocaleLowerCase() === '[object array]' &&
            Object.prototype.toString.call(repeatFields).toLocaleLowerCase() === '[object array]') {
                for (let i = 0; i < repeatFields.length; i++) {
                    const name = repeatFields[i];
                    reapeatObj[name] = [];

                    // 将要查重的字段的所有数据放到数组中
                    for (let j = 0; j < data.length; j++) {
                        const item = data[j].rowData ? data[j].rowData : data[j];
                        reapeatObj[name].push(item[name]);
                    }
                    // 判断数组长度 与 去重后的长度是否一致
                    if (reapeatObj[name].length !== [...new Set(reapeatObj[name])].length) {
                        reapeatNames.push(name);
                    }
                }
            }
            let tipMsg = '';
            reapeatNames.forEach((name) => {
                const colMsg = this.getColumn(name);

                tipMsg += `${colMsg.title} `;
            });

            if (tipMsg) {
                tipMsg += '列，数据不能重复！';
                if ($.etDialog) {
                    $.etDialog.error(tipMsg);
                } else {
                    alert(tipMsg);
                }
                return false;
            }
            return true;
        },
        /**
         * @description 更新grid表头指定列的列名
         * @param {number/string} dataIndx
         * @param {string} title
         */
        changeHeaderText(dataIndx, title) {
            const CM = this.option('colModel');
            let colIndx;
            if (typeof dataIndx === 'string') {
                colIndx = this.getColIndx(dataIndx);
            } else if (typeof dataIndx === 'number') {
                colIndx = dataIndx;
            }
            CM[colIndx].title = title;
            this.option('colModel', CM);
            this.refreshHeader();
        }
        /**
         * 数据加载完成后事件
         * @param  {function} fn 回调函数function (event, ui) {}
         */
        // success: function (fn) {
        //     grid.pqGrid("pqgridload", fn);
        // }
    };
    return methods;
}
export default Methods;