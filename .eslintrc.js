module.exports = {
    "extends": "airbnb-base",
    "rules": {
        "no-unused-vars": 1,                //不能有声明后未被使用的变量或参数
        "linebreak-style": [1, "windows"],  //换行风格
        "indent": [1, 4],           //空格缩进
        "quotes": [1, "single"],//引号类型 
        "comma-dangle": [2, "never"],
        "no-unused-expressions": 0,
        "func-names": 0,
        "no-param-reassign": 0,
        "eol-last": 0,
        "no-plusplus": 0,
        "prefer-rest-params": 0,
        "object-shorthand": 0
    },
    "env": {
        "node": true,
        "browser": true
    },
    "globals": {
        "jQuery": true,
        "$": true
    }
};