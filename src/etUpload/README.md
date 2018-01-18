# etUpload
## 参数
#### height: 190 插件高度
```
$().etUpload({
    height:190
})
```
#### width: 130 插件宽度
```
$().etUpload({
    width:130
})
```
#### multiple: false 多文件上传模式
```
$().etUpload({
    multiple:true
})
```
#### type: 'img' 文件上传类型
```
$().etUpload({
    type:'file'
});
// img只上传图片文件 file上传任意类型文件
```
## 事件
## 函数
####  getValues 获取上传文件 (多文件获取)
```
var upload = $().etUpload({
    multiple:true   
});
upload.getValues();
```
#### getValue 获取上传文件 (单文件获取)
```
var upload = $().etUpload({});
upload.getValue();
```
#### setValues 设置文件 (服务端路径字符串数组)
```
var upload = $().etUpload({});
upload.setValues(['abc.jpg,vvv.png']);
```
#### setValue 设置文件 (服务器路径字符串)
```
var upload = $().etUpload({});
upload.setValue('abc.jpg');
```