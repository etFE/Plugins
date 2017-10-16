import './style/main.css';

const defaultOptions = {
    height: 190,
    width: 130,
    onUpload: () => {

    },
    onCancel: () => {

    }
};
!(function ($) {
    $.fn.etUpload = function (options) {
        const result = {
            $el: {},
            type: 'image',
            isFile: false,
            getValue: () => { }
        };
        // 合并参数
        const opts = $.extend(true, {}, defaultOptions, options);
        // 构建组件
        const { height, width } = opts;
        const $file = this;
        $file.hide();
        const $main = $(`<div class="etUpload" style="height:${height}px;width:${width}px"></div>`);
        const $image = $(`<img class="image" style="height:${height - 30}px" alt="" src=""/>`);
        const $buttonUpload = $('<button class="button">上传</button>');
        const $buttonCancel = $('<button class="button">取消</button>');
        $file.wrap($main).before($image);
        $image.after($buttonCancel);
        $image.after($buttonUpload);


        // 上传按钮
        $buttonUpload.click(() => {
            $file.click();
        });

        // 取消按钮
        $buttonCancel.click(() => {
            result.isFile = false;
            $image.attr('src', '');
            $file.val('');
            if (typeof opts.onCancel === 'function') {
                opts.onCancel();
            }
        });

        // 文件change
        $file.change(() => {
            const file = $file.get(0).files[0];
            const reader = new FileReader();
            reader.onloadend = function () {
                $image.attr('src', reader.result);
                result.isFile = true;
                result.file = $file;
                if (typeof opts.onUpload === 'function') {
                    opts.onUpload();
                }
            };
            if (file) {
                reader.readAsDataURL(file);
            } else {
                $image.attr('src', '');
            }
        });

        result.getValue = () => {
            return $file.get(0).files[0];
        };

        return result;
    };
}(jQuery));