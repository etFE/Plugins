import Selectize from 'selectize';
import checkBoxPlugins from './checkbox';
import clearButtonPlugins from './clear_button';

Selectize.define('checkbox_mode', function (option) {
    option = $.extend({}, option);
    checkBoxPlugins(this, option);
});

Selectize.define('clear_button', function (option) {
    option = $.extend({}, option);
    clearButtonPlugins(this, option);
});