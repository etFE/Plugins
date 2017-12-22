import './style/main.css';
import render from './upload';

const defaultOptions = {
    height: 190,
    width: 130,
    multiple: false,
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
        // const { height, width } = opts;
        const resultMulti = render($main, opts);
        return resultMulti;
    };
}(jQuery));