import './etValidate.scss';
import vldMethods from './methds';

const defaults = {
    config: {
        emptyTip: '必填项,不可为空!',
        typeTip: '类型错误',
        formatTip: '格式错误',
        tipTime: 3000
    },
    items: [
        // {
        //     el: $('#el'),
        //     required: true,
        //     type: 'string',
        //     test: /a/ 可以写正则
        // }
    ]
};

class EtValidate {
    constructor(props) {
        const settings = $.extend(true, {}, defaults, props);

        this.VERSION = '1.0.0';
        this.pluginName = 'etValidate';
        this.config = settings.config;
        this.items = settings.items;
        return this;
    }

    /**
     * 遍历开启验证
     */
    test() {
        let isPass = true;
        this.items.forEach((item) => {
            const $vldEl = item.el;
            const elValue = $vldEl.val();

            // 验证是否有值
            if (item.required) {
                if (!elValue) {
                    const emptyTip = item.emptyTip || this.config.emptyTip;
                    const $tipEl = vldMethods.appendTipElment.call(this, $vldEl, emptyTip);

                    item.$tipEl = $tipEl || item.$tipEl;
                    isPass = false;
                } else {
                    vldMethods.removeTipElement.call(this, item.el, item.$tipEl);
                }
            }

            // 验证类型
            if (item.type && elValue) {
                let isRightType = true;

                switch (item.type) {
                case 'number':
                    if (isNaN(Number(elValue)) || typeof Number(elValue) !== 'number') {
                        isRightType = false;
                    }
                    break;
                case 'int':
                    if (typeof Number(elValue) === 'number') {
                        if (!/^(-|\+)?\d+$/.test(elValue)) {
                            isRightType = false;
                        }
                    } else {
                        isRightType = false;
                    }
                    break;
                
                // TODO: float判断还有点问题，当是整形的时候回判断false
                // case 'float':
                //     if (typeof Number(elValue) === 'number') {
                //         if (!/^(-|\+)?\d+\.\d*$/.test(elValue)) {
                //             isRightType = false;
                //         }
                //     } else {
                //         isRightType = false;
                //     }
                //     break;
                    // no default
                }

                if (!isRightType) {
                    const typeTip = item.typeTip || this.config.typeTip;
                    const $tipEl = vldMethods.appendTipElment.call(this, $vldEl, typeTip);

                    item.$tipEl = $tipEl || item.$tipEl;

                    isPass = false;
                } else {
                    vldMethods.removeTipElement.call(this, item.el, item.$tipEl);
                }
            }

            // 验证是否通过正则匹配
            if (item.test && elValue) {
                if (!item.test.test(elValue)) {
                    const formatTip = item.formatTip || this.config.formatTip;
                    const $tipEl = vldMethods.appendTipElment.call(this, $vldEl, formatTip);

                    item.$tipEl = $tipEl || item.$tipEl;
                    isPass = false;
                } else {
                    vldMethods.removeTipElement.call(this, item.el, item.$tipEl);
                }
            }
        });
        // 返回isPass
        return isPass;
    }

    /**
     * 关闭一个表单的验证
     * @param {jquery obj} $closeItem 关闭验证的jq对象
     */
    closeValidate($closeItem) {
        this.items.forEach((item, index) => {
            const itemNode = item.el[0];

            // 重置为false，关闭验证
            if (itemNode === $closeItem[0]) {
                if (this.items[index].required) {
                    this.items[index].required = false;
                }
                if (this.items[index].test) {
                    this.items[index].prevTest = this.items[index].test;
                    this.items[index].test = false;
                }

                vldMethods.removeTipElement.call(
                    this,
                    this.items[index].el,
                    this.items[index].$tipEl
                );
            }
        });
    }

    /**
     * 开启一个表单的验证
     * @param {jquery obj}  $openItem 开启验证的jq对象
     */
    openValidate($openItem) {
        this.items.forEach((item, index) => {
            const itemNode = item.el[0];

            // 启用为true，开启验证
            if (itemNode === $openItem[0]) {
                if (!this.items[index].required && typeof this.items[index].required === 'boolean') {
                    this.items[index].required = true;
                }
                if (this.items[index].prevTest) {
                    this.items[index].test = this.items[index].prevTest;
                    delete this.items[index].prevTest;
                }
            }
        });
    }

    /**
     * 添加一个表单验证
     * @param {obj} vldItem 添加需要验证的对象参数。
     */
    addItem(vldItem) {
        this.items.push(vldItem);
    }

    /**
     * 移除一个表单的验证
     * @param {jquer obj}  $removeItem 移除的jq对象
     */
    removeItem($removeItem) {
        this.items.forEach((item, index) => {
            const itemNode = item.el[0];

            // 重置为false，关闭验证
            if (itemNode === $removeItem[0]) {
                if (item.$tipEl) {
                    item.$tipEl.remove();
                }
                this.items.splice(index, 1);
            }
        });
    }
}

$.etValidate = function (options) {
    const etValidate = new EtValidate(options);
    return etValidate;
};
