import './index.scss';

const defaults = {
    url: '',
    param: {},
    onClick: null,
    onInit: null,
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
        pagesize: 20
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

    // scroll height diff
    const curScrollTop = this.$wrap.scrollTop();
    if (curScrollTop !== 0) {
        this.$wrap.scrollTop(curScrollTop + 60);
    }
};

const removeLoading = function () {
    this.$wrap.find('li.character-loading').remove();
};

const nothingAnymore = function () {
    const nothingHtml = '<li class="character-nothing">没有了</li>';

    this.$wrap.append(nothingHtml);
};

const loadData = function (url = this.url, param = this.param) {
    return new Promise((resolve, reject) => {
        const { $wrap } = this;
    
        loadLoading.call(this);
    
        $.ajax({
            url: url,
            data: param,
            type: 'POST',
            dataType: 'json',
            success: (res) => {
                this.total = res.Total || res.Rows.length;
                const items = res.Rows;
    
                items.forEach((item) => {
                    this.data.push(item);
    
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
                this.scrollFlag = true;
                resolve(res)
            }
        });
    })
};

// init
const init = function () {
    const { $wrap, pageModel, param } = this;
    $wrap.addClass('character-list');

    if (pageModel.type) {
        param.page = pageModel.page;
        param.changepage = pageModel.changepage;
        param.pagesize = pageModel.pagesize;
    }
    loadData.call(this).then((res) => {
        this.onInit && this.onInit(res)
    });
};

// events
const setup = function () {
    const { $wrap } = this;

    // 点击事件
    $wrap.on('click', '.character-item', (e) => {
        const theItem = e.currentTarget;

        $wrap.children().removeClass('active');
        $(theItem).addClass('active');
        this.selectedItem.user_code = $(theItem).attr('character-id');

        // 点击事件钩子
        this.onClick && this.onClick(this.selectedItem);
    });

    this.pageModel.type && $wrap.on('scroll', () => {
        const lastItem = $wrap.children(':last');
        const wrapHeight = $wrap.height();

        // 距离顶部高度 + 自身高度 - 外层距离顶部高度
        let lastItemToTop = lastItem.offset().top + lastItem.height();
        lastItemToTop -= $wrap.offset().top;

        // TODO: 注意这里的判断
        if (lastItemToTop < wrapHeight && this.scrollFlag) {
            const totalPage = Math.ceil(this.total / this.pageModel.pagesize);

            // console.log(totalPage, this.param.page)
            if (totalPage === this.param.page) {
                nothingAnymore.call(this);
                return;
            }
            this.param.page++;
            loadData.call(this, this.url, this.param);
        }
    });
};

class CharacterList {
    constructor($el, options) {
        this.VERSION = '1.1.0';
        this.$wrap = $el;
        this.scrollFlag = false;
        this.data = [];
        this.total = null;

        $.extend(true, this, defaults, options);

        init.call(this);
        setup.call(this);
        // console.log(this)
        return this;
    }

    // 重新加载
    reload() {
        this.scrollFlag = false;
        this.$wrap.children().remove();
        init.call(this);
    }

    // 获取状态
    setSelectedItem(id) {
        const theSelectItem = this.$wrap.find(`li[character-id=${id}]`)
        if (theSelectItem.get(0)) {
            this.clearSelected()
            theSelectItem.addClass('active')
            this.selectedItem.user_code = id
        }
    }
    // 获取状态
    getSelectedItem() {
        return this.selectedItem;
    }
    // 清除状态
    clearSelected() {
        this.selectedItem = {};
        this.$wrap.find('li.active').removeClass('active');
    }
}

$.fn.etCharacterList = function (options) {
    const initCharacterList = new CharacterList(this, options);

    return initCharacterList;
};
