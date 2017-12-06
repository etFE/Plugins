const defaults = {
    usePager: true,
    checkbox: false,
    flexHeight: false, //  容器高度以内容高度为准
    flexWidth: false, //  设置为true 则grid总宽度由内容撑开 没有滚动条  (默认为false)
    wrap: false, //  单元格内容完全显示 (默认为true)
    hwrap: false, //  标题列头文本溢出显示省略号， 改为false则为全部显示文本
    virtualX: false,
    virtualY: true, // 虚拟xy轴渲染， 建议大数据时设置为true
    showTitle: false, //  展现title
    stripeRows: true, // 隔行变色 (默认为true)
    addRowByKey: false, //  是否键盘控制增加行
    // resizable: true, //  可调试高宽度
    hoverMode: 'row', // 行hover
    hoverShowTitle: null,
    editable: false, // 默认不可编辑
    inWindowHeight: false, // 是否以窗口(window)高度为准来计算表格高度 默认为false,若true且height:'100%' 则表格高度等于window的高度
    dataModel: {
        cache: false,
        dataType: 'JSON',
        location: 'remote',
        sorting: 'local',
        sortDir: 'up',
        method: 'POST'
    },
    pasteModel: {
        on: false, // 粘贴 复制功能是否开启  默认关闭
        compare: 'byVal',
        select: true,
        validate: true,
        allowInvalid: true,
        type: 'replace'
    },
    selectionModel: {
        type: 'cell',
        mode: 'block'
    },
    trackModel: {
        on: true // 历史追踪模块
    },
    collapsible: {
        on: false
    }, //  展开折叠按钮
    scrollModel: {
        autoFit: false, // 默认值为 false， 设置为true时这不能调整列宽
        theme: true
    },
    numberCell: {
        resizable: false,
        width: 30,
        minWidth: 30
    },
    editModel: { // 编辑模块 控制如何进入编辑 保存
        saveKey: $.ui.keyCode.ENTER,
        keyUpDown: false,
        clicksToEdit: 2,
        cellBorderWidth: 0
    },
    swipeModel: {
        on: false
    }, //  禁止滑动
    pageModel: { //   让分页器文字信息显示汉字
        rPP: 50,
        type: 'local', // 默认本地分页 即前台分页  'remote' 后台分页  内部传到后台的key名：changepage、page(curPage)、pagesize(rPP)
        strPage: '第 {0} 页（共 {1} 页）',
        strFirstPage: '第一页',
        strPrevPage: '上一页',
        strNextPage: '下一页',
        strLastPage: '尾页',
        strRefresh: '刷新',
        strRpp: '每页记录: {0}',
        rPPOptions: [10, 20, 50, 100, 200, 500],
        strDisplay: '显示第 {0} 到 {1} 条，总共 {2} 条数据'
    },
    strLoading: '加载中',
    strAdd: '添加',
    strEdit: '编辑',
    strDelete: '删除',
    strSearch: '搜索',
    strNothingFound: '暂无结果',
    strNoRows: '暂无结果',
    strSelectedmatches: '选择{0}{1}匹配',
    strPrevResult: '上一结果',
    strNextResult: '下一结果'

};

export default defaults;