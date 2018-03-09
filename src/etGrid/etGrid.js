import defaultOptions from './defaultOptions';
import Methods from './methods';
import {
    replaceOption,
    buildGrid,
    createCheckBoxColumn,
    hoverShowTitle,
    createSummaryRows
} from './privateMethods';


!(function ($) {
    $.fn.etGrid = function (options) {
        const $self = this;
        const opts = $.extend(true, {}, defaultOptions, options);

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

        //  显示固定在表格底部的合计、平均值、最大值、最小值 的行
        if (opts.summaryRowIndx instanceof Array && opts.summaryRowIndx.length) {
            createSummaryRows($self, opts, options);
        } else if (opts.summary) {
            createSummaryRows($self, opts, options);
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