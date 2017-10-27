import './zTree/css/zTree.css';
import './zTree/js/jquery.ztree.all';
import './zTree/js/jquery.ztree.exhide';

$.fn.etTree = function (settings, treeNode) {
    const $self = this;
    const defaultSet = {
        data: {
            // 定义数据格式
            simpleData: {
                enable: true,
                idKey: 'id',
                pIdKey: 'pId',
                rootPId: null
            }
        },
        view: {
            dblClickExpand: false, // 是否双击展开
            selectedMulti: false // 是否允许节点多选
        }
        // 自定义参数，添加尾缀
        // ,addSuffix: function () {
        //     var treeNodes = tree.transformToArray(tree.getNodes());
        //     return {
        //         nodes: treeNodes,
        //         rules: [
        //             { rule: {status: 1}, text: '内置', color: 'red' },
        //             { rule: {status: 0}, text: '外置', color: 'red' }
        //         ]
        //     }
        // }
    };
    const opts = $.extend(true, {}, defaultSet, settings);

    // 判断是否添加尾缀
    if (opts.addSuffix) {
        let successFn = function () {};
        if (opts.callback && opts.callback.onAsyncSuccess) {
            successFn = opts.callback.onAsyncSuccess;
        }

        opts.callback.onAsyncSuccess = function (...successParam) {
            successFn(...successParam);

            // 封装层
            const { rules, nodes } = opts.addSuffix();
            const addNodes = nodes || [];

            let styleHtml = '<style>';
            rules.forEach((rule, index) => {
                styleHtml +=
                    `.tree_after_${index}:after {
                        content: '${rule.text}';
                        color: ${rule.color};
                    }`;
            });
            styleHtml += '</style>';

            $('body').prepend(styleHtml);

            addNodes.forEach((node) => {
                rules.forEach((rule, index) => {
                    const key = Object.keys(rule.rule)[0];
                    const value = rule.rule[key];

                    if (node[key] === value) {
                        $(`#${node.tId}`).addClass(`tree_after_${index}`);
                    }
                });
            });
        };
    }

    $self.addClass('ztree');
    const etTree = $.fn.zTree.init($self, opts, treeNode);

    return etTree;
};
