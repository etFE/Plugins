/**
 * 公共函数
 */

// 构建标签节点
function buildElement(type) {
    if (type === 'select') {
        return '<select></select>';
    }

    if (type === 'text') {
        return '<input class="text-input" type="text">';
    }

    if (type === 'date') {
        return '<input type="text">';
    }

    if (type === 'checkbox') {
        return '<input type="checkbox">';
    }

    if (type === 'file') {
        return '<input type="file">';
    }

    if (type === 'checkbox') {
        return '<input type="checkbox">';
    }
    return '<input>';
}

// 构建自定义插件
let widgetArray;
function initWidget($el) {
    widgetArray = $el;
    function initSelect($item) {
        const { OPTIONS } = $item;
        if (!$.fn.etSelect) {
            console.warn('下拉框插件未引用');
            return $item;
        }
        const widget = $item.$el.etSelect(OPTIONS);
        return widget;
    }

    function initDate($item) {
        const { OPTIONS } = $item;
        if (!$.fn.etDatepicker) {
            console.warn('日期框插件未引用');
            return $item;
        }
        const widget = $item.$el.etDatepicker(OPTIONS);
        return widget;
    }

    function initCheck($item) {
        const { OPTIONS } = $item;
        if (!$.fn.etCheck) {
            console.warn('复选框插件未引用');
            return $item;
        }
        const widget = $item.$el.etCheck();
        return widget;
    }

    function initFile($item) {
        const { OPTIONS } = $item;
        if (!$.fn.etUpload) {
            console.warn('复选框插件未引用');
            return $item.$el;
        }
        // TODO:
        return $item.$el;
    }

    function initInt($item) {
        const { OPTIONS } = $item;
        // TODO:
        return $item.$el;
    }

    function initFloat($item) {
        const { OPTIONS } = $item;
        // TODO:
        return $item.$el;
    }

    $.each($el, (index, element) => {
        const { $field, type, OPTIONS } = element;
        if (element.type === 'select') {
            element.widget = initSelect({ $el: $field, OPTIONS: OPTIONS });
        }

        if (type === 'date') {
            element.widget = initDate({ $el: $field, OPTIONS: OPTIONS });
        }

        if (element.type === 'text') {
            // nothing
            element.widget = $field;
        }

        if (element.type === 'checkbox') {
            element.widget = initCheck({ $el: $field, OPTIONS: OPTIONS });
        }

        if (element.type === 'file') {
            element.widget = initFile({ $el: $field, OPTIONS: OPTIONS });
        }

        if (element.type === 'int') {
            element.widget = initInt({ $el: $field, OPTIONS: OPTIONS });
        }

        if (element.type === 'float') {
            element.widget = initFloat({ $el: $field, OPTIONS: OPTIONS });
        }
    });
}

// 获取插件数组
function getWidgetArray() {
    if (!widgetArray) {
        console.warn('widget is not build ,please use this function initWidget !');
    }
    return widgetArray;
}

// 构建表单项
function initLayout(fieldArr, colNum) {
    const $table = $('<table class="table-layout" style="width:100%"></table>');
    let $tr = $('<tr></tr>');
    let counter = 0;
    fieldArr.forEach((v) => {
        const { $field, place } = v;
        const $label = $(v.label);
        const $input = $(v.input);
        counter += place;

        if (counter > colNum) { // 上一次满
            counter = place;
            $table.append($tr);
            $tr = $('<tr></tr>').append($label).append($input.append($field));
        } else if (counter > colNum) { // 上一条溢出
            counter = place;
            $table.append($tr);
            $tr = $('<tr></tr>').append($label).append($input.append($field));
        } else {
            $tr.append($label).append($input.append($field));
        }
    });
    $table.append($tr);
    return $table;
}

export { buildElement, initWidget, initLayout, getWidgetArray };