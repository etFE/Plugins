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
    };
    const opts = $.extend(true, {}, defaultSet, settings);

    $self.addClass('ztree');
    const etTree = $.fn.zTree.init($self, opts, treeNode);

    return etTree;
};
