const plugins = function (thisRef, options) {
    const self = thisRef;
    // const fieldLabel = self.settings.labelField;
    // const fieldOptGroup = self.settings.optgroupLabelField;
    self.setup = (function () {
        const original = self.setup;

        return function () {
            original.apply(self, arguments);

            self.$clear_button = $('<div class="select-clear-button">' +
                '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
                '<path fill="currentColor" d="M18.984 6.422l-5.578 5.578 5.578 5.578-1.406 1.406-5.578-5.578-5.578 5.578-1.406-1.406 5.578-5.578-5.578-5.578 1.406-1.406 5.578 5.578 5.578-5.578z"></path>' +
                '</svg>' +
                '</div>');
            self.$clear_button.on('click', () => {
                self.clear();
            });

            self.$control.after(self.$clear_button);
        };
    }());
};

export default plugins;