# etCheck
## 参数
#### checked 是否选中
```
$().etCheck({
    checked:true
})
```
#### disabled 是否禁用
```
$().ecCheck({
    disabled:true
})
```
## 事件
#### onInit 初始化执行
```
$().etCheck({
    onInit:function(){

    }
})
```
#### onCheck 选中执行
```
$().etCheck({
    onCheck:function(){
        
    }
})
```
#### onUnCheck 取消选中执行
```
$().etCheck({
    onUnCheck:function(){
        
    }
})
```
#### onChange 勾选改变执行
```
$().etCheck({
    onChange:function(){
        
    }
})
```
#### onDisable 禁用时执行
```
$().etCheck({
    onDisable:function(){
        
    }
})
```
#### onEnable 可用时执行
```
$().etCheck({
    onEnable:function(){
        
    }
})
```
## 函数
#### setCheck 设置选中
```
var check = $().etCheck();
check.setCheck();
```
#### setUncheck 设置不选中
```
var check = $().etCheck();
check.setUncheck();
```
#### setDisable 设置禁用
```
var check = $().etCheck();
check.setDisable();
```
#### setEnable 设置可用
```
var check = $().etCheck();
check.setEnable();
```