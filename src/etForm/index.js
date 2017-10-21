import './style/etForm.css';

const defaultOptions = {
    fieldItems: [
        {
            id: 'select',
            name: '下拉框',
            type: 'select',
            width: '250px',
            fieldWidth: 120,
            data: [{ id: '1', text: '测试1' }, { id: '2', text: '测试2' }]
        },
        {
            id: 'text', name: '文本框', type: 'text', width: '250px', fieldWidth: 120
        },
        {
            id: 'date', name: '日期框', type: 'date', width: '250px', fieldWidth: 120
        },
        {
            id: 'checkbox', name: '复选框', type: 'checkbox', width: '100%'
        }
    ],
    onInit: function () { }
};

// 构建标签
function buildField(type) {
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

// 构建插件
function initWidget($el) {
    function initSelect($item) {
        if (!$.fn.etSelect) {
            console.warn('下拉框插件未引用');
            return $item;
        }
        const widget = $item.$el.etSelect({
            options: $item.data
        });
        return widget;
    }

    function initDate($item) {
        if (!$.fn.etDatepicker) {
            console.warn('日期框插件未引用');
            return $item;
        }
        const widget = $item.etDatepicker({

        });
        return widget;
    }

    function initCheck($item) {
        if (!$.fn.etCheck) {
            console.warn('复选框插件未引用');
            return $item;
        }
        const widget = $item.etCheck({

        });
        return widget;
    }

    function initFile($item) {
        if (!$.fn.etUpload) {
            console.warn('复选框插件未引用');
            return $item;
        }
        // TODO
        return $item;
    }

    function initInt($item) {
        // TODO
        return $item;
    }

    function initFloat($item) {
        // TODO
        return $item;
    }


    $.each($el, (index, element) => {
        const { $field, type, data } = element;
        if (element.type === 'select') {
            element.widget = initSelect({ $el: $field, data: data });
        }

        if (type === 'date') {
            element.widget = initDate($field);
        }

        if (element.type === 'text') {
            // nothing
            element.widget = '';
        }

        if (element.type === 'checkbox') {
            element.widget = initCheck($field);
        }

        if (element.type === 'file') {
            element.widget = initFile($field);
        }

        if (element.type === 'int') {
            element.widget = initInt($field);
        }

        if (element.type === 'float') {
            element.widget = initFloat($field);
        }
    });
}


!(function ($) {
    $.fn.etForm = function (options) {
        // 合并参数
        const opts = $.extend(true, {}, defaultOptions, options);
        const $self = this;
        const $el = [];
        const result = {};
        $self.addClass('form_content');

        // 循环添加表单项
        opts.fieldItems.forEach((item, index) => {
            const $item = $(`<div class="form_item" style="width:${item.width || ''}"></div>`);
            const $label = $(`<label for="${item.id}">${item.name}：</label>`).appendTo($item);
            const $field = $(buildField(item.type))
                .attr('id', item.id)
                .css({ width: item.fieldWidth })
                .appendTo($item);
            const fieldItem = {
                id: item.id,
                type: item.type,
                data: item.data || '',
                $item: $item,
                $label: $label,
                $field: $field
            };
            $el.push(fieldItem);
            $self.append($item);

            result[item.id] = fieldItem;
        });

        // 构建完成事件
        if (typeof opts.onInit === 'function') {
            opts.onInit($el);
        }

        const methods = {
            initWidget: function () {
                initWidget($el);
            }
        };
        result.itemArray = $el;

        return $.extend(true, {}, result, methods);
    };
}(jQuery));