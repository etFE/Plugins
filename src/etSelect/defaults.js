
const defaults = {
    options: [],
    items: [],
    valueField: 'id',
    labelField: 'text',
    searchField: ['text'],
    backEndSearch: true, // 是否后台检索
    url: '',
    type: 'POST',
    defaultValue: '',
    maxOptions: 50,
    maxItems: 1,
    mode: '',
    showClear: true,
    checkboxMode: false,
    plugins: ['clear_button', 'option_title']
};

export default defaults;

