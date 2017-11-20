/**
 * 生成组件事件
 * @param {object} $self
 * @param {object} opts
 */
function Events($self, opts) {
    const checkObj = {
        status: '',
        checked: false,
        disabled: false
    };
    checkObj.options = opts;

    $self.on('ifCreated', () => {
        if (typeof opts.onInit === 'function') {
            opts.onInit();
        }

        // 设置状态
        if (opts.checked) {
            $self.prop('checked', true);
            checkObj.checked = true;
            checkObj.status = 'checked';
        }
        if (opts.disabled) {
            $self.prop('disabled', true);
            checkObj.disabled = true;
            checkObj.status = 'disabled';
        }
    });
    // 被销毁时
    $self.on('ifDestroyed', () => {
        if (typeof opts.onDestroy === 'function') {
            opts.onDestroy();
        }
    });
    // 选择时
    $self.on('ifChecked', () => {
        if (typeof opts.onCheck === 'function') {
            opts.onCheck();
        }
    });
    // 取消选择时
    $self.on('ifUnchecked', () => {
        if (typeof opts.onUnCheck === 'function') {
            opts.onUnCheck();
        }
    });
    // 被禁用时
    $self.on('ifDisabled', () => {
        if (typeof opts.ifDisabled === 'function') {
            opts.ifDisabled();
        }
    });
    // 被启用时
    $self.on('ifEnabled', () => {
        if (typeof opts.onEnable === 'function') {
            opts.onEnable();
        }
    });
    // 点击时。
    $self.on('ifClicked', () => {
        if (typeof opts.onClick === 'function') {
            opts.onClick();
        }
    });
    // 状态改变时
    $self.on('ifChanged', () => {
        if ($self.get(0).disabled) {
            checkObj.status = 'disabled';
            checkObj.disabled = true;
        } else {
            if ($self.get(0).checked) {
                checkObj.status = 'checked';
            } else {
                checkObj.status = 'unchecked';
            }
            checkObj.disabled = false;
        }
        if (typeof opts.onChange === 'function') {
            opts.onChange(checkObj.status, checkObj.checked, checkObj.disabled);
        }
    });
    // toggle。因为click 》toggle 》change。在click时状态还未附上。所以状态判断放这里
    $self.on('ifToggled', () => {
        if ($self.get(0).checked) {
            checkObj.status = 'checked';
            checkObj.checked = true;
        } else {
            checkObj.status = 'unchecked';
            checkObj.checked = false;
        }
        if (typeof opts.onToggle === 'function') {
            opts.onToggle(checkObj.checked);
        }
    });
    return checkObj;
}

export default Events;