import 'icheck';
import './style/icheck.css';
import defaultOptions from './defaults';
import initMethod from './methods';
import initEvent from './events';

!(function ($) {
    $.fn.etCheck = function (options) {
        const $self = this;
        const opts = $.extend({}, defaultOptions, options);
        /**
         * 提供外部接口
         */
        const methods = initMethod($self);

        /**
         * 构造组件
         */
        const $check = $self.iCheck(opts);

        /**
         * 构造事件
         */
        const checkObj = initEvent($self, opts);
        checkObj.$el = $check;

        return $.extend(checkObj, methods);
    };
}(jQuery));
