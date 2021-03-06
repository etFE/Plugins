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

    if (type === 'range') {
        return `<div>
            <input type="text" style="width:44%">至<input type="text" style="width:44%">
        </div> `;
    }
    return '<input>';
}

// 构建自定义插件
let widgetArray;
function initWidget($el, onInitWidget) {
    widgetArray = $el;
    function initSelect($item) {
        const { OPTIONS, value } = $item;
        if (!$.fn.etSelect) {
            console.warn('下拉框插件未引用');
            return $item;
        }
        const widget = $item.$el.etSelect(OPTIONS);
        if (value) { widget.setValue(value); }
        return widget;
    }

    function initDate($item) {
        const { OPTIONS, value } = $item;
        if (!$.fn.etDatepicker) {
            console.warn('日期框插件未引用');
            return $item;
        }
        const widget = $item.$el.etDatepicker(OPTIONS);
        if (value) { widget.setValue(value); }
        return widget;
    }

    function initCheck($item) {
        const { OPTIONS, value } = $item;
        if (!$.fn.etCheck) {
            console.warn('复选框插件未引用');
            return $item;
        }
        const widget = $item.$el.etCheck();
        if (value) { widget.setCheck(); }
        return widget;
    }

    function initFile($item) {
        const { OPTIONS, value } = $item;
        if (!$.fn.etUpload) {
            console.warn('复选框插件未引用');
            return $item.$el;
        }
        // TODO:
        return $item.$el;
    }
    function initTxt($item) {
        const { OPTIONS, value } = $item;
        if (value) { $item.$el.val(value); }
        return $item.$el;
    }

    function initInt($item) {
        const { OPTIONS, value } = $item;
        // TODO:
        return $item.$el;
    }

    function initFloat($item) {
        const { OPTIONS, value } = $item;
        // TODO:
        return $item.$el;
    }

    function initRange($item) {
        const { OPTIONS, value, rangeId } = $item;
        const [id0, id1] = OPTIONS.rangeId;
        const value0 = value ? value[0] : '';
        const value1 = value ? value[1] : '';
        $item.$el.find('input').eq(0)
            .attr('id', id0)
            .val(value0);
        $item.$el.find('input').eq(1)
            .attr('id', id1)
            .val(value1);
        return $item.$el;
    }

    $el.forEach((element, index) => {
        const {
            $field,
            type,
            OPTIONS,
            value
        } = element;
        if (element.type === 'select') {
            element.widget = initSelect({ $el: $field, OPTIONS: OPTIONS, value: value });
        } else if (type === 'date') {
            element.widget = initDate({ $el: $field, OPTIONS: OPTIONS, value: value });
        } else if (element.type === 'text') {
            // nothing
            element.widget = initTxt({ $el: $field, OPTIONS: OPTIONS, value: value });
        } else if (element.type === 'checkbox') {
            element.widget = initCheck({ $el: $field, OPTIONS: OPTIONS, value: value });
        } else if (element.type === 'file') {
            element.widget = initFile({ $el: $field, OPTIONS: OPTIONS, value: value });
        } else if (element.type === 'int') {
            element.widget = initInt({ $el: $field, OPTIONS: OPTIONS, value: value });
        } else if (element.type === 'float') {
            element.widget = initFloat({ $el: $field, OPTIONS: OPTIONS, value: value });
        } else if (element.type === 'range') {
            element.widget = initRange({ $el: $field, OPTIONS: OPTIONS, value: value });
        }
    });

    // 插件创建完成事件
    if (typeof onInitWidget === 'function') {
        onInitWidget(widgetArray);
    }
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

// 构建验证
function initValidate($el, onInitValidate) {
    if (!$.etValidate) {
        console.warn('验证插件未引用');
        return '';
    }
    const validateItems = widgetArray.map((v, i) => ({ el: v.$field, required: v.required }));
    const validate = $.etValidate({
        config: {
        },
        items: validateItems
    });
    // 插件创建完成事件
    if (typeof onInitValidate === 'function') {
        onInitValidate($el);
    }
    return validate;
}

// 获取表单数据
function getFormData() {
    function getValue(value) {
        const { type, $field, widget } = value;
        if (type === 'select') {
            return widget.getValue();
        } else if (type === 'date') {
            return widget.getValue();
        } else if (type === 'file') {
            return widget.getValue();
        } else if (type === 'checkbox') {
            return widget.checked;
        } else if (type === 'range') {
            const array = [$field.find('input').eq(0).val(), $field.find('input').eq(1).val()];
            return array;
        }
        return $field.val();
    }

    const formData = new FormData();
    if (!widgetArray) {
        console.warn('widget is not build ,please use this function initWidget !');
        return formData;
    }

    widgetArray.forEach((v, i) => {
        if (v.type === 'range') {
            const el0 = v.$field.find('input').eq(0);
            const el1 = v.$field.find('input').eq(1);
            formData.append(el0.attr('id'), el0.val());
            formData.append(el1.attr('id'), el1.val());
        } else {
            formData.append(v.id, getValue(v));
        }
    });
    return formData;
}

export {
    buildElement,
    initWidget,
    initLayout,
    initValidate,
    getWidgetArray,
    getFormData
};