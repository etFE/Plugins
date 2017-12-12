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
                opts.dataModel.getData = function (response, textStatus, jqXHR) {
                    const data = response.Rows;
                    $self.summaryRows = [];
                    if (!data.length) {
                        return false;
                    }
                    // 过滤出放在底部冻结行(合计行)的数据
                    for (let i = 0; i < opts.summaryRowIndx.length; i++) {
                        const Indx = opts.summaryRowIndx[i];
                        if (typeof Indx !== 'number') {
                            return false;
                        }
                        $self.summaryRows.push(data[Indx]);
                        data.splice(Indx, 1);
                    }
                    response.data = data;

                    if (typeof options.dataModel.getData === 'function') {
                        return options.dataModel.getData(response, textStatus, jqXHR);
                    }
                    return response;
                };
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

        const grid = $self.pqGrid(opts);
        const methods = Methods(grid);
        const $grid = $.extend({}, grid, methods);
        buildGrid(grid, $grid);
        return $grid;
    };
}(jQuery));