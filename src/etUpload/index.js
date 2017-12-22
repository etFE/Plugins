import './style/main.css';
import render from './upload';

const defaultOptions = {
    height: 190,
    width: 130,
    multiple: false,
    type: 'img',
    onUpload: () => {

    },
    onCancel: () => {

    }
};
!(function ($) {
    $.fn.etUpload = function (options) {
        const $main = this;
        // 合并参数
        const opts = $.extend(true, {}, defaultOptions, options);
        // 构建组件
        const result = render($main, opts);
        return result;
    };
}(jQuery));