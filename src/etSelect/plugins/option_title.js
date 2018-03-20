const plugins = function (thisRef, options) {
    const self = thisRef;
    self.setup = (function () {
        const original = self.setup;

        return function () {
            original.apply(self, arguments);

            self.$dropdown_content.on('mouseover', '.option', function (e) {
                $(this).attr('title', $(this).get(0).innerHTML);
            });
        };
    }());
};

export default plugins;