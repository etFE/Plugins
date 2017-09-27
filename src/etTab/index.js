import './etTab.scss';

const defaults = {
    active: '',
    onCreate: () => {},
    onChange: () => {}
};

// 更新状态
const tabChangeStatus = function ($label, $panel, tabid, index) {
    $panel.addClass('ettab-active');
    $label.addClass('ettab-active');

    this.status.active = {
        tabid,
        $label,
        $panel,
        index
    };
};

// 改变标签
const tabChangeTab = function ($label) {
    if ($label.hasClass('ettab-active')) {
        return;
    }
    const tabid = $label.attr('tabid');
    const $panel = this.tabPanelObj[tabid];
    const index = $label.index();

    this.status.active.$label.removeClass('ettab-active');
    this.status.active.$panel.removeClass('ettab-active');
    tabChangeStatus.call(this, $label, $panel, tabid, index);

    // 钩子 - 改变事件
    this.opts.onChange(this.status.active);
};

// 事件处理中心
const tabSetup = function () {
    const that = this;
    this.$tabNav.on('click', '.ettab-tab', function () {
        tabChangeTab.call(that, $(this));
    });
};

// 初始化
const tabInit = function () {
    const $panels = this.$ettab.children('div[title]');
    $panels.each((index, panel) => {
        const $panel = $(panel);
        const tabTitle = $panel.attr('title');
        const tabid = $panel.attr('tabid');
        const $label = $(`<li class="ettab-tab" tabid="${tabid}">${tabTitle}</li>`);

        $panel
            .addClass('ettab-panel')
            .removeAttr('title');

        this.tabLabelObj[tabid] = $label;
        this.tabPanelObj[tabid] = $panel;
        this.$tabContent.append($panel);
        this.$tabNav.append($label);

        if (this.opts.active && (this.opts.active === tabid || this.opts.active === index)) {
            tabChangeStatus.call(this, $label, $panel, tabid, index);
        } else if (index === 0) {
            tabChangeStatus.call(this, $label, $panel, tabid, index);
        }
    });

    this.$ettab
        .addClass('ettab-container')
        .append(this.$tabNav)
        .append(this.$tabContent);

    tabSetup.call(this);
    // 钩子 - 构建完事件
    this.opts.onCreate(this.status.active);
};

class EtTab {
    constructor($el, options) {
        this.VERSION = '1.0.0';
        this.pluginName = 'etTab';
        this.$ettab = $el;
        this.$tabNav = $('<ul class="ettab-nav"></ul>');
        this.$tabContent = $('<div class="ettab-content"></div>');
        this.tabLabelObj = {};
        this.tabPanelObj = {};
        this.status = {
            active: {
                index: 0,
                tabid: '',
                $label: null,
                $panel: null
            }
        };

        this.opts = $.extend({}, defaults, options);

        tabInit.call(this);
        return this;
    }

    ChangeTab() {
        tabChangeTab.call(this);
    }
}

$.fn.etTab = function (options) {
    const etTab = new EtTab(this, options);
    return etTab;
};
