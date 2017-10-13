/**
 * 定义私有方法
 * 执行任意方法时，必须用call进行重定向this
 */

// 移除验证提示框，取消验证状态
const removeTipElement = function ($el, $tipEl) {
    $el.removeAttr('showValidate');

    if ($tipEl) {
        $tipEl.remove();
    }
};

// 添加验证提示框的节点
const appendTipElment = function ($el, tip) {
    if ($el.attr('showValidate')) {
        return false;
    }

    const $tipEl = $(`<div class="etValidate_tip_wrap">
                <span class="etValidate_tip_msg">${tip}</span>
            </div>`);

    // 添加正在显示提示框的属性
    $el.attr('showValidate', true);

    let elTop = $el.offset().top + $el.height() + 10;
    let elLeft = $el.offset().left;

    // 针对etSelect插件的判断
    if ($el.hasClass('selectized')) {
        const $selectEl = $el.next();
        elTop = $selectEl.offset().top + $selectEl.height() + 5;
        elLeft = $selectEl.offset().left;
    }

    $tipEl
        .appendTo($('body'))
        .css({
            top: elTop,
            left: elLeft
        });

    if (this.config.tipTime) {
        setTimeout(() => {
            removeTipElement.call(this, $el, $tipEl);
        }, this.config.tipTime);
    }

    return $tipEl;
};

export default {
    appendTipElment,
    removeTipElement
};