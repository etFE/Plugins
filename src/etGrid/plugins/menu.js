!(function ($) {
    $.fn.menu = function (options) {
        const defaultOpt = {
            width: 180
        };
        const opts = $.extend(true, {}, defaultOpt, options);
        const $this = this;
        const Func = {};
        const htmlCreateMenu = function ($obj, items = []) {
            if (items.length) {
                const $ul = $('<ul class="menu_ul"></ul>');
                items.forEach((item) => {
                    let $li = $(`<li class='menu_li'><a href='javascript:;' class='menu_a'>${item.text}</a></li>`);
                    if (item.line) {
                        $li = $('<li class="menu_separate"></li>');
                    } else if (item.icon) {
                        const $icon = $('<i class="menu_icon"></i>');
                        $icon.appendTo($li);
                    } else if (item.children) {
                        $li = $(`<li class='menu_li'><a href='javascript:;' class='menu_a'><i class='triangle'></i>${item.text}</a></li>`);
                        const $Child = $('<div class="menuChild"></div>');
                        $Child.css({
                            left: $li.width(),
                            top: '-1px'
                        });
                        htmlCreateMenu($Child, item.children);
                        $Child.appendTo($li);
                    } else if (item.click) {
                        Func[item.text] = {
                            click: item.click,
                            target: item
                        };
                    }
                    $li.appendTo($ul);
                    $obj.append($ul);
                });
                return false;
            }
            return false;
        };
        htmlCreateMenu($this, opts.items);

        /* ************样式处理********** */
        const $Child = $this.find('.menuChild');
        const $Pli = $Child.parent('li');
        $this.width(opts.width).addClass('menu_main');
        $Child.css({
            left: $Pli.width() - 5,
            top: 0,
            width: opts.width
        });
        /* ************事件处理********** */
        $('.menu_li').hover(function () {
            $(this).find('.menuChild').show();
        }, function () {
            $(this).find('.menuChild').hide();
        });
        $(this).on('click', '.menu_li', function (event) {
            const text = $(this).text();
            if (Func[text]) {
                const item = Func[text].target;
                event = event || window.event;
                event.stopPropagation();
                Func[text].click && Func[text].click(item, event);
            }
        });
    };
}(jQuery));