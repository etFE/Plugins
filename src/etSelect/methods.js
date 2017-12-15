/**
 * 生成组件方法
 * @param {object} select
 */
function Methods(select) {
    const obj = {
        reload: ({ url, type, para }) => {
            select.para = para;

            $.ajax({
                url: url,
                type: type || 'POST',
                dataType: 'JSON',
                data: para
            }).then((res) => {
                const optList = res;
                let defaultValue = select.settings.defaultValue || '';
                select.clearOptions();
                select.addOption(res);
                if (defaultValue !== 'none') {
                    if (!select.options[defaultValue]) {
                        defaultValue = optList[0] ? optList[0][select.settings.valueField] : '';
                    }
                    select.setValue(defaultValue);
                }
            });
        },
        clearItem: () => {
            select.clear();
        },
        getItem: (separator) => {
            const result = separator ? select.items.join(separator) : select.items;
            let resultItem = '';
            if (result.length < 2) {
                resultItem = result[0] ? select.options[result[0]] : '';
            } else {
                resultItem = result.map(v => select.options[v]);
            }
            return resultItem;
        },
        clearOptions: () => {
            select.clearOptions();
        },
        addOptions: (option) => {
            select.addOption(option);
        },
        setValue: (value, silent) => {
            select.setValue(value, silent);
        },
        getValue: (separator) => {
            const result = separator ? select.items.join(separator) : select.items;
            if (result.length < 2) {
                return result[0] || '';
            }
            return result;
        },
        getOptions: () => select.options,
        getText: (separator) => {
            const result = separator ? select.items.join(separator) : select.items;
            let resultText = '';
            if (result.length < 2) {
                resultText = result[0] ? select.options[result[0]][select.settings.labelField] : '';
            } else {
                resultText = result.map(v => select.options[v][select.settings.labelField]);
            }
            return resultText;
        },
        open: () => {
            select.open();
        },
        disabled: () => {
            select.$clear_button.hide();
            select.disable();
        },
        enabled: () => {
            select.$clear_button.show();
            select.enable();
        }
    };

    return obj;
}


export default Methods;