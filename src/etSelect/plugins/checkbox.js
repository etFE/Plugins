const plugins = function (thisRef, options) {
    const self = thisRef;
    const fieldLabel = self.settings.labelField;
    const fieldOptGroup = self.settings.optgroupLabelField;
    self.settings.render = {
        option: (data, escape) => {
            const ret = `<div class="option option-checkbox" title="${escape(data[fieldLabel])}">
                            <div class="selectize-checkbox" data-checked></div>${escape(data[fieldLabel])}
                        </div>`;
            return ret;
        }
    };

    self.setup = (function () {
        const original = self.setup;

        return function () {
            original.apply(self, arguments);

            self.$dropdown_header = $('<div class="selectize-dropdown-header " data-selectable>' +
                '<div class="selectize-checkbox" data-checked></div>' +
                '<label>全部</label>' +
                '</div>');

            // dropdown-header，点击全选事件
            self.$dropdown_header.on('click', () => {
                const $checkboxAll = self.$dropdown_header.children('.selectize-checkbox');
                const $checkboxs = self.$dropdown_content.find('.selectize-checkbox');
                let isChecked = $checkboxAll.attr('data-checked');

                isChecked === 'true' ? isChecked = true : isChecked = false;

                $checkboxAll.attr('data-checked', !isChecked);
                $checkboxs.attr('data-checked', !isChecked);

                if (!isChecked) {
                    for (let key in self.options) {
                        if (self.options.hasOwnProperty(key)) {
                            self.addItem(key);
                        }
                    }
                } else {
                    for (let key in self.options) {
                        if (self.options.hasOwnProperty(key)) {
                            self.removeItem(key);
                        }
                    }
                }
            });
            self.$dropdown.prepend(self.$dropdown_header);

            // 解绑插件的选择框click事件，输入框键盘事件
            self.$dropdown.off('click');
            self.$control_input.off('keydown');

            // options的单选事件
            self.$dropdown.on('mousedown', '.option-checkbox', function () {
                const $checkbox = $(this).children('.selectize-checkbox');
                const value = $(this).attr('data-value');
                let isChecked = $checkbox.attr('data-checked');
                isChecked === 'true' ? isChecked = true : isChecked = false;

                if (isChecked) {
                    self.removeItem(value);
                }
                $checkbox.attr('data-checked', !isChecked);
            });
        };
    }());

    // 重置是为了不选择item
    self.onItemSelect = function () {
        return undefined;
    };

    // 重置只是为了让input一直定位在前面。只改了i的赋值
    self.setCaret = function () {
        let i = 0;
        let self = this;

        if (self.settings.mode === 'single') {
            i = self.items.length;
        } else {
            i = Math.max(0, Math.min(self.items.length, i));
        }

        if (!self.isPending) {
            var j, n, fn, $children, $child;
            $children = self.$control.children(':not(input)');
            for (j = 0, n = $children.length; j < n; j++) {
                $child = $($children[j]).detach();
                if (j < i) {
                    self.$control_input.before($child);
                } else {
                    self.$control.append($child);
                }
            }
        }
        self.caretPos = i;
    };
};

export default plugins;