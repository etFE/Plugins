# etFrom
## 参数
#### colNum:3 表单列数
```
$().etForm({
    colNum:3
})
```
#### fieldItem:[] 表单项
```
$().etForm({
    fieldItem:[
        id:'id',
        name:'下拉框|文本框|日期框|复选框|...',
        type:'select|text|date|checkbox|...',
        width:'180px',
        place:1,
        value:'默认值',
        required:false,
        OPTIONS:{}
    ]
});
```
## 事件
#### onInitElement 元素构建完成事件
```
$().etForm({
    onInitElement:function(){

    }
})
```
#### onInitWidget 插件构建完成事件
```
$().etForm({
    onInitWidget:function(){
        
    }
})
```
#### onInitValidate 验证构建完成事件
```
$().etForm({
    onInitValidate:function(){
        
    }
})
```
## 函数
#### initWidget 将表单项构建成组件
```
var form = $().etForm({});
form.initWidget();
```
#### initValidate 将表单项添加为空验证
```
var form = $().etForm({});
form.initValidate();
```
#### getWidgetArray 获取插件数组
```
var form = $().etForm({});
form.initWidget();
form.getWidgetArray(); //需要先构建成插件
```
#### getFormData 获取表单对象
```
var form = $().etForm({});
form.initWidget();
form.getFormData(); //需要先构建成插件
```