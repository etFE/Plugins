!(function () {
    var head = document.getElementsByTagName('HEAD').item(0);
    var scriptConf = {
        // "jquery": { src: "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js" },
        "jquery_ui": { src: "../jqueryui/jquery-ui.min.js" },
        "plugin": { src: "pqgrid.min.js", dependent: "jquery_ui", complete: complete }
    }

    var styleConf = {
        "jquery_ui": { href: "../jqueryui/themes/base/jquery-ui.css" },
        "plugin": { href: "pqgrid.min.css" },
        "plugin_themes": { href: "themes/office/pqgrid.css" }
    }


    loadScript();
    loadStyle();
    //加载样式
    function loadStyle() {
        for (var key in styleConf) {
            if (styleConf.hasOwnProperty(key)) {
                var style = styleConf[key];
                var element = initStyle(style.href);
                head.appendChild(initStyle(style.href));
            }
        }

        function initStyle(href) {
            var link = document.createElement("link");
            link.href = href;
            link.rel = "stylesheet";
            return link;
        }
    }

    //加载脚本
    function loadScript() {
        reConfig();
        initScripts();

        function reConfig() {
            for (var key in scriptConf) {
                if (scriptConf.hasOwnProperty(key)) {
                    var script = scriptConf[key];
                    script.dom = initScript(script.src);
                    if (script.dependent) {
                        if (!scriptConf[script.dependent].onload) {
                            scriptConf[script.dependent].onload = [];
                        }
                        scriptConf[script.dependent].onload.push(key);
                    }
                }
            }

            function initScript(src) {
                var script = document.createElement("script");
                script.src = src;
                return script;
            }
        }

        function initScripts() {
            for (var key in scriptConf) {
                if (scriptConf.hasOwnProperty(key)) {
                    var script = scriptConf[key];
                    if (script.onload) {
                        (function (element, onload) {
                            element.onload = function () {
                                for (var i = 0; i < onload.length; i++) {
                                    var name = onload[i];
                                    head.appendChild(scriptConf[name].dom);
                                }
                            }
                        })(script.dom, script.onload);
                    }

                    if (!script.dependent) {
                        head.appendChild(script.dom);
                    }
                    if(script.complete){
                        script.dom.onload = function(){
                            script.complete();
                        }
                    }
                }
            }


        }
    }

    function complete() {
        var fn = window.editTable;
        if (typeof fn === "function") {
            fn();
        } else {
            console.log("editTable is undefined");
        }
    }
})()