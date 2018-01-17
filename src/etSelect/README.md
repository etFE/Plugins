# etSelect
## 参数
#### options:[] 静态数据 
```
$().etSelect({
    options:[{id:'1',text:'选项1'}]
})
```

#### items: [] 选中的数据 
```
$().etSelect({
    items:[{id:'1',text:'选项1'}]
})
```
#### valueField: 'id' 选项的key值字符串
```
$().etSelect({
    options:[{keyId:'1',text:'选项'}],
    valueField:'keyId'
})
```
#### labelField: 'text' 选项的value值字符串
```
$().etSelect({
    options:[{id:'1',valueText:'选项'}],
    labelField:'valueText'
})
```
#### searchField: ['text'] 检索字符串数组
```
$().etSelect({
    options:[{id:'1',value:'选项'}],
    searchField:['id'] 
});
// 在前台检索时候 输入1则检索 id为1的选项
```
#### backEndSearch: true 是否后台检索
```
$().etSelect({
    backEndSearch: true
})
// 屏蔽前台检索 输入选项会触发 后端请求
```
#### url: '' 接口路径
```
$().etSelect({
    url: 'http://'
})
```
#### type: 'POST' 接口请求方式
```
$().etSelect({
    type:'get'
});
// 请求get方式的接口
```
#### defaultValue: '' 默认选中项
```
$().etSelect({
    defaultValue:'0'
});
// 初始化选中项 不填则选中第一条 填'none' 则初始化 不选中任何项
```

#### mode: '' 
#### checkboxMode: false 勾选模式
```
$().etSelect({
    mode:'single',
    checkboxMode:true
});
// 与checkboxMode参数一起使用 
// 默认可多选  single为单选模式
```
#### showClear: true 是否显示清空按钮
```
$().etSelect({
    showClear:false
});
```
## 事件
#### onInit 初始化执行
```
$().etSelect({
    onInit:function(){

    }
});
```
#### onSelect 选中执行
```
$().etSelect({
    onSelect:function(){

    }
});
```
#### load 输入检索 query为输入的内容 callback回调函数
```
$().etSelect({
    load:function(query,callback){
        $.ajax({
            url:'url'+query
            success:function(res){
                callback(res);
            }
        })
    }
})
```
## 函数
#### reload 重新加载
```
var select = $().etSelect({});
select.reload({
    url:'',
    type:'post',
    para:{}
})
```
#### clearItem 清空选中项
```
var select = $().etSelect({});
select.clearItem();
```
#### getItem 获取选中项 (对象)
```
var select = $().etSelect({});
select.getItem();
```
#### clearOptions 清空下拉列表
```
var select = $().etSelect({});
select.clearOptions();
```
#### addOptions 添加下拉列表数据
```
var select = $().etSelect({});
select.addOptions([{id:'1',text:'选项1'}]);
```
#### setValue 设置选中项
```
var select = $().etSelect({});
select.setValue(1);
```
#### getValue 获取选中项 (key值)
```
var select = $().etSelect({});
select.getValue();
```
#### getOptions 获取所有下拉数据
```
var select = $().etSelect({});
select.getOptions();
```
#### getText 获取选中项 (文本值)
```
var select = $().etSelect({});
select.getText();
```
#### open 展开下拉框
```
var select = $().etSelect({});
select.open();
```
#### disabled 下拉框不可用
```
var select = $().etSelect({});
select.disabled();
```
#### enabled 下拉框可用
```
var select = $().etSelect({});
select.enabled();
```
