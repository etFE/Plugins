import './style/etForm.css';
import defaultOptions from './default';
import {
    buildElement,
    initWidget,
    initLayout,
    initValidate,
    getWidgetArray,
    getFormData
} from './common';

!(function ($) {
    $.fn.etForm = function (options) {
        // 合并参数
        const opts = $.extend(true, {}, defaultOptions, options);

        const $self = this;
        const $el = [];
        const fieldArr = [];
        const result = {};
        $self.addClass('form_content');

        // 循环添加表单项
        opts.fieldItems.forEach((item, index) => {
            const $field = $(buildElement(item.type))
                .attr('id', item.id)
                .css({ width: item.width });
            // place 不可大于colNum 如果大于则按照colNum计算
            const place = (item.place || 1) > opts.colNum ? opts.colNum : item.place;
            const colSpan = (place * 2) - 1; // input所在td占colspan 计算方式: place * 2 - 1
            const labelHTML = `<td class="label ${item.required ? 'no-empty' : ''}" align="right">${item.name}：</td>`;
            const inputHTML = `<td class="ipt" colSpan=${colSpan}></td>`;
            const fieldItem = {
                id: item.id,
                type: item.type,
                $field: $field,
                required: item.required,
                OPTIONS: item.OPTIONS,
                value: item.value
            };
            $el.push(fieldItem);
            result[item.id] = fieldItem;

            fieldArr.push({
                label: labelHTML, input: inputHTML, place: place, $field: $field
            });
        });

        // 构建页面布局
        $self.append(initLayout(fieldArr, opts.colNum));

        // 构建完成事件
        if (typeof opts.onInitElement === 'function') {
            opts.onInitElement($el);
        }

        // 构建接口函数
        const methods = {
            initWidget: function () {
                initWidget($el, opts.onInitWidget);
            },
            initValidate: function () {
                return initValidate({}, opts.onInitValidate);
            },
            getWidgetArray: function () {
                return getWidgetArray();
            },
            getFormData: function () {
                return getFormData();
            }
        };
        return $.extend(true, {}, result, methods);
    };
}(jQuery));