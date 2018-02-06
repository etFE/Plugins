import defaultOptions from './default';
import {
    fillSummaryData
} from './summaryMethods';
import Methods from './methods';
import {
    replaceOption,
    buildGrid,
    createCheckBoxColumn,
    hoverShowTitle
} from './common';


!(function ($) {
    $.fn.etGrid = function (options) {
        const $self = this;
        const opts = $.extend(true, {}, defaultOptions, options);

        /**
         * @description  内部生成生成合计行的函数
         */
        $self.$summary;
        $self.summaryRows = []; //   摘要合计行节点、 摘要行数据   (全局变量)
        function createSummaryRows() {
            opts.render = function (event, ui) {
                // 生成合计行的节点 储存到$summary里
                $self.$summary = $('<div class="pq-grid-summary"></div>')
                    .prependTo($('.pq-grid-bottom', this));
                if (opts.summary) {
                    $self.summaryRows = fillSummaryData($self, opts);
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
                    $self.summaryRows = fillSummaryData($self, opts);
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
                opts.cbModel.getDataCbs.push({
                    func: (response) => {
                        const data = response.Rows;
                        if (!data.length) {
                            // 保证response格式的正确返回
                            response.Rows = [];
                            return response;
                        }
                        // 如果当前是第一页，那么去获取数据覆盖summary，否则保留原有被覆盖数据
                        if ($self.pqGrid('option', 'pageModel.curPage') === 1) {
                            $self.summaryRows = [];

                            // 过滤出放在底部冻结行(合计行)的数据
                            for (let i = 0; i < opts.summaryRowIndx.length; i++) {
                                const Indx = opts.summaryRowIndx[i] - i;
                                if (typeof Indx !== 'number') {
                                    return false;
                                }
                                $self.summaryRows.push(data[Indx]);
                                data.splice(Indx, 1);
                            }
                        }
                        return response;
                    }
                });
                // opts.dataModel.getData = function (response, textStatus, jqXHR) {
                //     const data = response.Rows;
                //     if (!data.length) {
                //         return false;
                //     }
                //     // 如果当前是第一页，那么去获取数据覆盖summary，否则保留原有被覆盖数据
                //     if ($self.pqGrid('option', 'pageModel.curPage') === 1) {
                //         $self.summaryRows = [];

                //         // 过滤出放在底部冻结行(合计行)的数据
                //         for (let i = 0; i < opts.summaryRowIndx.length; i++) {
                //             const Indx = opts.summaryRowIndx[i] - i;
                //             if (typeof Indx !== 'number') {
                //                 return false;
                //             }
                //             $self.summaryRows.push(data[Indx]);
                //             data.splice(Indx, 1);
                //         }
                //     }
                //     response.data = data;
                //     if (options.dataModel && options.dataModel.getData && typeof options.dataModel.getData === 'function') {
                //         return options.dataModel.getData(response, textStatus, jqXHR);
                //     }
                //     return response;
                // };
            }
            opts.refresh = function (event, ui) {
                $(this).pqGrid('createTable', {
                    $cont: $self.$summary,
                    data: $self.summaryRows

                });
                if (typeof options.refresh === 'function') {
                    options.refresh(event, ui);
                }
            };
        }
        opts.colModel = replaceOption(opts);

        // 构造checkbox列
        if (opts.checkbox) {
            createCheckBoxColumn(opts);
            if (opts.freezeCols) {
                opts.freezeCols += 1;
            } else {
                opts.freezeCols = 1;
            }
        }
        // 是否开启分页器
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
            hoverShowTitle($self, opts);
        }

        /**
         ************************
         * 内部事件的 二次处理中心 ↓↓↓
         ************************
         */

        /**
         * load 事件内部执行 simon 2018/2/6
         */
        (() => {
            const loadFunc = opts.load;

            opts.load = (event, ui) => {
                // 在load时要执行的回调函数数组
                const loadCbs = $self.pqGrid('option', 'cbModel.loadCbs');

                for (let i = 0; i < loadCbs.length; i++) {
                    const item = loadCbs[i];

                    typeof item.func === 'function' && item.func(event, ui);

                    if (item.isOnce) {
                        loadCbs.splice(i, 1);
                        i--;
                    }
                }
                loadFunc && loadFunc(event, ui);
            };
        })();

        /**
         * getData 事件内部执行 simon 2018/2/6
         * getData中，重要是返回response。每个插入的回调函数都必须返回正确格式的response，
         * 来保证之后的中间函数能正确处理数据
         */
        (() => {
            const getDataFunc = opts.dataModel.getData;

            opts.dataModel.getData = (response, textStatus, jqXHR) => {
                // 在getData时要执行的回调函数数组
                const getDataCbs = $self.pqGrid('option', 'cbModel.getDataCbs');

                for (let i = 0; i < getDataCbs.length; i++) {
                    const item = getDataCbs[i];

                    if (typeof item.func === 'function') {
                        response = item.func(response, textStatus, jqXHR);
                    }
                    if (item.isOnce) {
                        getDataCbs.splice(i, 1);
                        i--;
                    }
                }
                // 优先处理组件内部的getData，再处理外部的
                if (getDataFunc) {
                    response = getDataFunc(response, textStatus, jqXHR);
                }
                response.data = response.Rows;

                return response;
            };
        })();

        const grid = $self.pqGrid(opts);
        const methods = Methods(grid);
        const $grid = $.extend({}, grid, methods);
        buildGrid(grid, $grid);
        return $grid;
    };
}(jQuery));