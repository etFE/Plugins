import './index.scss';

const defaults = {
    url: '',
    data: {},
    onClick: null,
    selectedItem: {},
    // msgData: [
    //     { id: 'id' },
    //     { name: '姓名' },
    //     { staff: '职务' },
    //     { wechat: '微信' }
    // ],
    pageModel: {
        type: false,
        page: 1,
        changepage: 1,
        pageSize: 20
    }
};

const loadLoading = function () {
    const loadingHtml = `<li class="character-loading">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 28 28">
            <title>spinner</title>
            <path fill="currentColor" d="M8.219 21.781c0 1.094-0.891 2-2 2-1.094 0-2-0.906-2-2 0-1.109 0.906-2 2-2 1.109 0 2 0.891 2 2zM16 25c0 1.109-0.891 2-2 2s-2-0.891-2-2 0.891-2 2-2 2 0.891 2 2zM5 14c0 1.109-0.891 2-2 2s-2-0.891-2-2 0.891-2 2-2 2 0.891 2 2zM23.781 21.781c0 1.094-0.906 2-2 2-1.109 0-2-0.906-2-2 0-1.109 0.891-2 2-2 1.094 0 2 0.891 2 2zM8.719 6.219c0 1.375-1.125 2.5-2.5 2.5s-2.5-1.125-2.5-2.5 1.125-2.5 2.5-2.5 2.5 1.125 2.5 2.5zM27 14c0 1.109-0.891 2-2 2s-2-0.891-2-2 0.891-2 2-2 2 0.891 2 2zM17 3c0 1.656-1.344 3-3 3s-3-1.344-3-3 1.344-3 3-3 3 1.344 3 3zM25.281 6.219c0 1.937-1.578 3.5-3.5 3.5-1.937 0-3.5-1.563-3.5-3.5 0-1.922 1.563-3.5 3.5-3.5 1.922 0 3.5 1.578 3.5 3.5z"></path>
        </svg>
    </li>`;

    this.$wrap.append(loadingHtml);
};

const removeLoading = function () {
    this.$wrap.find('li.character-loading').remove();
};

const loadData = function (url = this.url, data = this.data) {
    const { $wrap } = this;

    loadLoading.call(this);

    $.ajax({
        url: url,
        data: data,
        type: 'POST',
        dataType: 'json',
        success: (items) => {
            items.forEach((item) => {
                const listHtml =
                    `<li class="character-item" character-id="${item.user_code}">
                        <div class="character-avatar">
                            <img src="${item.photo}" alt="${item.emp_name}" />
                        </div>
                        <ul class="character-msg">
                            <li>姓名：${item.emp_name}</li>
                            <li>职务：${item.duty_name}</li>
                            <li>微信：${item.mobile}</li>
                        </ul>
                    </li>`;

                $wrap.append(listHtml);
            });
            removeLoading.call(this);
        }
    });
};

// init
const init = function () {
    const { $wrap, pageModel, data } = this;
    $wrap.addClass('character-list');

    if (pageModel.type) {
        data.page = pageModel.page;
        data.changepage = pageModel.changepage;
        data.pageSize = pageModel.pageSize;
    }
    loadData.call(this);
};

// events
const setup = function () {
    const { $wrap, selectedItem, onClick, pageModel } = this;

    // 点击事件
    $wrap.on('click', '.character-item', function () {
        $wrap.children().removeClass('active');
        $(this).addClass('active');
        selectedItem.user_code = $(this).attr('character-id');

        // 点击事件钩子
        onClick && onClick(selectedItem);
    });

    pageModel.type && $wrap.on('scroll', function (e) {
        const lastItem = $(this).children(':last');
        const lastItemToTop = lastItem.offset().top + lastItem.height();
        const wrapHeight = $(this).height();

        if (lastItemToTop < wrapHeight) {
            console.log(1)
        }
        // console.log(e);
    });
};

class CharacterList {
    constructor($el, options) {
        this.VERSION = '1.0.1';
        this.$wrap = $el;

        $.extend(true, this, defaults, options);

        init.call(this);
        setup.call(this);
        console.log(this);
        return this;
    }

    // 重新加载
    reload() {
        this.$wrap.children().remove();
        init.call(this);
    }

    // 获取状态
    getSelectedItem() {
        return this.selectedItem;
    }
    // 清楚状态
    clearSelected() {
        this.selectedItem = {};
        this.$wrap.find('li.active').removeClass('active');
    }
}

$.fn.etCharacterList = function (options) {
    const initCharacterList = new CharacterList(this, options);

    return initCharacterList;
};
