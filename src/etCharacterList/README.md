# 用户信息列表 #

[TOC]

> 人资系统在用组件
> 默认只显示人物头像，人物名称，职务，微信

### 基本用法 ###

```html
<!-- html -->
<div id="character_list"></div>
```

```javascript
// javascript
// 初始化
var character_list = $('#character_list').etCharacterList({
    url: 'http://118.178.184.131:9090/characterList',
    param: {},
    onClick: function (selectedItem) {
        console.log(selectedItem)
    },
    pageModel: {
        type: true
    }
});

// 获取被选择项目
character_list.getSelectedItem()
```

### 基本配置 ###

#### `url: ''` ####

> 请求路径

#### `param: {}` ####

> 请求参数

#### `pageModel` ####

> 分页模式
> 默认关闭，设置`pageModel.type` 为 `true` 开启

```javascript
// 默认参数
pageModel: {
    type: false,
    page: 1,
    changepage: 1,
    pagesize: 20
}
```

### 事件 ###

#### `onClick: null` ####

> 点击回调函数
> 返回信息对象

### 方法 ###

#### `reload` ####

> 重新加载

#### `getSelectedItem` ####

> 获取被选择的项目

#### `clearSelected` ####

> 清楚被选择状态
