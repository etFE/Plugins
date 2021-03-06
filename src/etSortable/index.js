import Sortable from 'sortablejs';
import defaultOptions from './default';
import './style/main.css';

// 添加一行
function buildRow(rowData, { checkbox, columns, dragHandle }) {
    const $li = $('<li class="row"></li>');

    // 复选框
    if (checkbox) {
        $li.append('<span class="check-box"><input type="checkbox" /></span>');
    }

    // 行数据
    columns.forEach((col) => {
        const $span = $(`<span style="width:${col.width}px;max-width:${col.width}px">${rowData[col.name] || ''}</span>`);
        $li.append($span);
    });

    // 拖拽列
    if (dragHandle) {
        $li.append('<span class="handle">☰</span>');
    }
    return $li;
}

// 构建表格
function buildTable({
    columns, data, dragHandle, checkbox
}) {
    const $ul = $('<ul></ul>');

    /* start 添加列头 */
    const $header = $('<li class="header"></li>');

    // 复选框
    if (checkbox) {
        $header.append('<span class="check-box"><input type="checkbox" /></span>');
    }

    // 列头数据
    columns.forEach((v) => {
        const $span = $(`<span style="width:${v.width}px;max-width:${v.width}px">${v.display}</span>`);
        $header.append($span);
    });

    // 拖拽列
    if (dragHandle) {
        $header.append('<span class="header-handle"></span>');
    }
    $ul.append($header);
    /* end 添加列头 */

    /* start 添加数据 */
    data.forEach((row) => {
        const $li = buildRow(row, { checkbox, columns, dragHandle });
        $ul.append($li);
    });
    /* end 添加数据 */
    return $ul;
}

function buildColumn($table) {
    const $ul = $('<ul class="column"></ul>');
    const $li = $table.find('li.header');
    $ul.append($li);
    return $ul;
}

// 构建事件
function initEvent($table) {
    // 判断是否全部选中
    function ifAllRowChecked() {
        const $check = $table.find('.row .check-box input'); // 行复选框
        for (let i = 0; i < $check.length; i++) {
            const element = $check[i];
            if (!$(element).prop('checked')) {
                return false;
            }
        }
        return true;
    }

    // 全选事件
    $table.parent().on('change', '.column .header .check-box input', () => {
        const $checkAll = $table.parent().find('.header .check-box input'); // 列头复选框
        const $check = $table.find('.row .check-box input'); // 行复选框
        const checked = $checkAll.prop('checked');
        $check.prop('checked', checked);
        $check.change();
    });

    // 行复选框事件
    $table.on('change', '.row .check-box input', (e) => {
        const $checkAll = $table.parent().find('.header .check-box input'); // 列头复选框
        const $row = $(e.target).parent().parent();
        const checked = $(e.target).prop('checked');
        if (checked) {
            $row.addClass('checked');
        } else {
            $row.removeClass('checked');
        }
        if (ifAllRowChecked()) {
            $checkAll.prop('checked', true);
        } else {
            $checkAll.prop('checked', false);
        }
    });
}

// 数据上移
function prev(index, arr) {
    const curValue = arr[index];
    const targetValue = arr[index - 1];
    arr[index - 1] = curValue;
    arr[index] = targetValue;
}

// 数据下移
function next(index, arr) {
    const curValue = arr[index];
    const targetValue = arr[index + 1];
    arr[index + 1] = curValue;
    arr[index] = targetValue;
}

// 数组元素移动
function moveItem(o, n, arr) {
    const oldItem = arr[o];
    arr.splice(n, 0, oldItem);
    arr.splice(o, 1);
}

function insertItem(item, n, arr) {
    arr.splice(n, 0, item);
}

// 节点上移
function prevDom(index, $el) {
    const curDom = $el.find('.row').eq(index);
    const targetDom = $el.find('.row').eq(index - 1);
    curDom.insertBefore(targetDom);
}
// 节点下移
function nextDom(index, $el) {
    const curDom = $el.find('.row').eq(index);
    const targetDom = $el.find('.row').eq(index + 1);
    curDom.insertAfter(targetDom);
}

!(function ($) {
    $.fn.etSortable = function (options) {
        const $this = $(this);
        // 合并参数
        const opts = $.extend(true, {}, defaultOptions, options);
        // 基本数据
        const result = {
            data: opts.data,
            columns: opts.columns
        };
        // 创建列表
        const $table = buildTable(opts);
        // 创建列头
        const $column = buildColumn($table);
        // 填充到主容器
        $this.append($column).append($table);
        // 创建事件
        initEvent($table);

        $this.height(opts.height);
        $table.height(opts.height - 27);

        Sortable.create($table.get(0), opts);
        // 函数
        const methods = {
            getChecked: () => { // 获取选中信息
                const checked = {
                    checkedIndex: [],
                    checkedRows: [],
                    checkedData: []
                };
                $table.find('.row').each((i, v) => {
                    if ($(v).find('input').prop('checked')) {
                        checked.checkedIndex.push(i);
                        checked.checkedRows.push(v);
                        checked.checkedData.push(result.data[i]);
                    }
                });
                return checked;
            },
            getData: () => result.data,
            addRows: (rows) => { // 批量添加行
                // 填充到页面上
                rows.forEach((row) => {
                    const $li = buildRow(row, opts);
                    $table.append($li);
                });
                // 填充到数据里
                result.data.push(...rows);
            },
            addRow: (row) => { // 添加行
                const $li = buildRow(row, opts);
                $table.append($li);
                result.data.push(row);
            },
            deleteRows: (rowsIndex) => { // 根据索引删除行
                const $el = [];
                rowsIndex.forEach((v) => {
                    $el.push($table.find('.row').eq(v));
                });
                $el.forEach((v) => {
                    v.remove();
                });
                result.data = result.data.filter((item, i) => rowsIndex.indexOf(i) === -1);

                // 删除完恢复全选
                const $checkAll = $table.parent().find('.header .check-box input'); // 列头复选框
                $checkAll.prop('checked', false);
            },
            deleteCheckedRows: () => { // 删除选中行
                const { getChecked, deleteRows } = methods;
                const { checkedIndex } = getChecked();
                deleteRows(checkedIndex);
            },
            deleteAllRows: () => { // 删除所有数据
                const { getData, deleteRows } = methods;
                const dataIndex = [];
                for (let i = 0, len = getData().length; i < len; i++) {
                    dataIndex.push(i);
                }
                deleteRows(dataIndex);
            },
            prevMove: () => { // 向上移动数据改变排序
                const { checkedIndex } = methods.getChecked();
                // 判断是否可移动
                if (checkedIndex[0] < 1) {
                    console.warn('已经是第一条无法上移');
                    return;
                }
                for (let i = 0, len = checkedIndex.length; i < len; i++) {
                    prev(checkedIndex[i], result.data);
                    prevDom(checkedIndex[i], $table);
                }
            },
            nextMove: () => { // 向下移动数据 改变排序
                const { checkedIndex } = methods.getChecked();
                // 判断是否可移动
                if (checkedIndex[checkedIndex.length - 1] === result.data.length - 1) {
                    console.warn('已经是最后一条无法下移动');
                    return;
                }
                for (let i = checkedIndex.length - 1; i >= 0; i--) {
                    next(checkedIndex[i], result.data);
                    nextDom(checkedIndex[i], $table);
                }
            },
            reload: (data) => { // 从新加载数据
                $table.find('.row').remove();
                result.data = data;
                data.forEach((row) => {
                    const { checkbox, dragHandle, columns } = opts;
                    const $li = buildRow(row, { checkbox, columns, dragHandle });
                    $table.append($li);
                });
            }
        };
        const res = $.extend(true, result, methods);
        return res;
    };
}(jQuery));
