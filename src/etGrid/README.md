# etGrid
## 参数
#### columns:[] 静态数据 
eg:
```
gridObj.columns = [
    {
        display:'sdf',
        align:'center',
        name:'rank',
        width:100,
        minWidth: 100,
        maxWidth: 120,
        cl: 'g-row',
        editable: true,
        halign: 'right',
        hidden: false,
        filter:{
            ....
        },
        columns: [
            {
                display: 'children',
                name: '子级',
            }
        ]
    },
    {
        display:'sdf',
        align:'center',
        name:'company',
        width: 100
    },
    ...
]
```

#### `column > align: "left"`   对齐 ####

> value: "left"/"right"/"center"

#### `column > cl: null`   设置class (加上自定义class名) ####

#### `column > columns: null`  多表头() ####

#### `column > copy: null`   复制 ####

> 阻止列被复制到剪贴板并被导出到Excel

#### `column > name: "colIndx"`   列名  ####

#### `column > dataType: "string"`  数据类型 ####
> type: string、integer、float、date、function

#### `column > editable: true` 是否编辑 ####
> type: Boolean、Function

#### `column > editModel: null` 编辑设置(同全局的editModel的参数一样) ####
> 将会覆盖全局的editModel

#### `column > editor: null` 编辑设置 ####
> 将会覆盖全局的editModel
```
editor: {
    type: "textbox", // textbox，textarea，contenteditable，select，checkbox，callback function，html string或null
    cls: "",
    style: "",
    change:function () {

    }
}
```
eg: 
```
// 下拉框编辑框
editor: {
     type: 'select',  //编辑框为下拉框时
     autoFocus:true,   //  为true时 下拉框默认选择第一个
     disabled:false,
     source:[],   //  静态数据接口  也可以是回调函数返回值
     url:   ,      //  动态数据接口
     open: function() {

     },
     select: function() {

     },
     change: function() {

     },
     close: function() {

     }
 }
```
```
// 日期编辑框
editor: {
     type: 'date', 
     onSelect: function () {
     },
     beforeShow: function (input, inst) {

     },
     onClose: function () {

     }
 }
```
```
// 表格编辑框
editor: {
    type: 'grid',
    resizable: true,
    columns: [{
        display: 'a',
        align: 'center',
        width: 120,
        name: 'a'
    }, {
        display: 'b',
        align: 'center',
        width: 120,
        name: 'b'
    }, {
        display: 'c',
        align: 'center',
        width: 120,
        name: 'c'
    }],
    dataModel: {
        url: '',
    },
    width: 500,
    height: 200
}
                
```
#### `column > relyOn: []` 列的依赖项 ####
>级联下拉框查询的参数，key是传参参数名，field是在rowData查找值的key

eg:
```
grid.columns = [{
    relyOn: [{
        key: 'key1',
        field: 'company1'    // 依赖同一行的company1列单元格
    },{
        key: 'key2',
        field: 'company2'    // 依赖同一行的company2列单元格
    },...]
}，{
    display: '公司名',
    name: 'company'
}]

则向后台传参是 [{name: key1, value: '...'},{name: key2, value: '...'}]
```

#### `column > filter: null` 过滤 ####
> type: object

eg:
```
filter: {
    type: "", // textbox, textarea, select, checkbox,
    attr: "",
    condition: "", //contain, notcontain, begin, end, equal, notequal, empty, notempty, less, great.
    value: 
}
```
#### `column > halign: center` 表头的文本位置 ####
> value: left、right、center

#### `column > hidden: false` 是否隐藏 ####
> value: true、false

#### `column > maxWidth: "100%"` 最大宽度设置 ####
> type: Integer or String

#### `column > minWidth: "100%"` 最小宽度设置 ####
> type: Integer or String

#### `column > render( ui ): null ` 列的渲染事件 ####
> type: function

#### `column > resizable: true ` 列的宽度是否可调 ####
> value: true、false

#### `column > isSort: true ` 列排序 ####
> value: true、false

#### `column > display: null ` 显示文字 ####
> 列头显示文字

#### `column > type: null ` 显示文字 ####
>  'checkBoxSelection' (设置此参数则某一列为复选框)、'detail'

#### `column > validations: null ` 列验证 ####

eg:
```
columns[1].validations = [ 
    { type: 'regexp', value: /[0-9]{2}/[0-9]{2}/[0-9]{4}/, msg: 'Not in mm/dd/yyyy format.'},
    {
        type: '', //minLen，maxLen，gt，gte，lt，lte，regexp，nonEmpty或callback函数
       //eg: type:function(ui) {
       //   var value = ui.value;
       //   if (...) {
        //          ui.msg = value + "没找到";
        //          $('.pq-editor-focus').css  ('border-color','#f00');
        //      return false;
        //   }   
        //} 
        value: '',
        msg: '', // 提示内容
    }
];
```

### columnBorders: true ###

> 列边框是否显示
```
{
    columnBorders: false
}
```
### rowBorders：false 表格行边框是否展现
> type: boolean


### columnTemplate: null ###

> column 列的全局配置 若每个列中有相同的属性，则覆盖全局配置

eg:
```
columnTemplate:{
        minWidth: 80,
        resizable: true
    }
```
### dataModel: null  数据模块 ###
> type: object

eg: 
```
grid.etGrid({
    dataModel: {
        beforeSend: function (jqXHR, settings) {

        },
        contentType :'application/json; charset=UTF-8',
        dataType: 'JSON',
        recIndx: 'a' ,
        location: 'remote',
        url:'....',
    }
}
```

#### `dataModel > beforeSend( jqXHR, settings )` 远程数据接收前事件
> 回调函数，发送请求前修改jqXHR，返回false将取消请求

#### `dataModel > contentType: undefined` 内容类型标头 (一般可不写)
eg:
```
 dataModel: { 
            contentType :'application/json; charset=UTF-8' 
    }
```

#### `dataModel > data:null`  表格本地数据设置
> type: array/JSON

eg: 
```
grid.etGrid({
    dataModel: {
        data: [...],
        // data: {}
    }
})

// getter
var data = grid.option('dataModel.data');

// setter
grid.option('dataModel.data', data)

```
#### `dataModel > dataType:"JSON"`  数据远程请求时服务器的响应类型 (一般可不写) 
> value: "TEXT","XML","JSON"

#### `dataModel> error（jqXHR，textStatus，errorThrown）`  数据远程请求时ERROR的回调函数  (一般可不写) 
eg:
```
{
    dataModel:{
        error:function( jqXHR, textStatus, errorThrown ){

        } 
    }
}
```
#### `dataModel > getData（response，textStatus，jqXHR）`  远程服务器与grid渲染时之间的回调函数 （一般用来修改传过来的数据格式）

eg:
```
dataModel: {
    getData :function (response，textStatus，jqXHR) {

    }
}
```

#### `dataModel > getUrl ()` 通过此回调函数可设置远程传递参数 如果两个选项都被提到，getUrl会优先于url。

eg：
```
dataModel: {
    getUrl: function () {
        return {
            url: "./...",
            data: {
                key1: val1,
                key2: val2,
                key3: val3
            }
        }
    }
}
```
#### `dataModel > location: "local"` 设置本地或是后台请求

>value: "remote", "local"

eg: 
```
{
    dataModel: {
        location: "local"
    }
}
```
#### `dataModel > method: "POST"` 设置远程请求时 请求方法
> value: post、get

eg: 
```
{
    dataModel: {
        method: "post"
    }
}
```

#### `dataModel > postData: Function/object` 远程请求时,传给后台的远程后台参数
> type: function/object

eg:
```
dataModel: {
    postData: {
        key1:value,
        key2: value
    }
}
```

#### `dataModel > postDataOnce: null` 远程请求时,传给后台的远程后台参数(只发送给服务器一次，然后丢失它的值)
>type: object  与postData参数object格式一样

#### `dataModel > recIndx: null`  记录主键的标识符/名称 (建议加上此属性 键盘快捷键时有依赖到)
> 任意column里的name值  

eg: recIndx: 'colName1'

#### `dataModel > sortDir: 'up' `  列的排列方向需与sortIndx关联 (建议加上此属性 键盘快捷键时有依赖到)
> type: string、array

#### `dataModel > sortIndx: null ` 排序的一列或多列的dataIndx。当使用数组时，会变成多列排序。
> type: string、array、integer

```
{
    dataModel: {
        sortIndx: [2]/"company"
    }
}
```

#### `dataModel > sorting: 'local' ` 排序的一列或多列的dataIndx。当使用数组时，会变成多列排序。
> value: local、remote

#### `dataModel > url: 'http://....'`  远程数据的请求

### 以上dataModel属性都可以在渲染后设置参数值  
eg：
```
grid.option('dataModel.dataType','TEXT')

grid.option('dataModel.getData', function() {})

grid.option('dataModel.getUrl', function() {})
...
```

### detailModel: obj 详细视图
>type: object    包含详细视图信息，对于表格嵌套很有用
```
detailModel: {
    cache: true,  // 缓存细节视图。行的折叠和展开会导致刷新细节数据。false时查看
    init: fn(rowData), // 回调函数，接受rowData作为参数，必须将详细视图作为jq对象返回
    collapseIcon: "ui-icon-triangle-1-e",图标
    expandIcon: "ui-icon-triangle-1-se"图标
}
```

### dragColumns: obj 详细视图
> 拖动列的样式
```
dragColumns: {
    enable: true, // 默认启用
    acceptIcon：'ui-icon-check', // 默认图标
    rejectIcon：'ui-icon-closethick'，
    topIcon：'ui-icon-circle-arrow-s'，
    bottomIcon：'ui-icon-circle- arrow-n'
}
```

### draggable: false     是否可拖拽 
> value: false、true

### editable: true       表格是否可编辑
> type: boolean、Function

> value: false、true、function

### editModel: obj       表格编辑时的设置属性
```
(默认值)
editModel: {
    clicksToEdit: 2, // 1,2,点击，双击进入编辑
    saveKey: $.ui.keyCode.ENTER, // 除了Tab外，可以自定义ascll码 ，默认值'$.ui.keyCode.ENTER' enter键
    filterKeys: true, // 防止dataType定义的整数或浮点数有非数字
    keyUpDown: false, // 上下键导航编辑单元格 (若为true,则有可能影响单元格里的下拉框键盘控制 ,建议为false)
    onBlur: "validate"， // 使编辑器保持编辑状态
    allowInvalid: false, // 为true时不拒绝无效值
    invalidClass: "ui-tstate-error" // 验证失败是添加class
}
```
### editor: obj   编辑类型 此对象里的属性会被每一列的editor里的同一属性给覆盖
```
editor: {
    type: "text", 
    cls: "", 
    style: "", 
    select: false
}
```

### filterModel：obj  表格数据过滤(模糊)查询设置
```
 filterModel: {
     on: true,  // 过滤器打开关闭属性
     mode: "AND",  // 过滤模式"AND"/"OR"
     header: false,  // 为true时，过滤器控件显示在列头中
     type: null   // "local","remote"
 }
```
### flexHeight: false、flexWidth: false 
> 高度调整。为true时，grid随内容自动撑开高度

> type boolean

### freezeCols: 0 冻结列数 从第一列开始(复选框除外)
> type  Integer

### freezeRows: 0 冻结行数 从第一行开始
> type  Integer

### groupModel: null 分组模块
> 定义每页展示数据数

#### `groupModel > collapsed: [false, true,...]` ([一级 ,二级,...])  定义组是否展开折叠 
> type: array

#### `groupModel > dataIndx: null` 哪一列展示收缩按钮  
> type: array

```
groupModel: {
    dataIndx: [colname1, colname2,...]  // 数组里的元素就是column里的name
}
```

#### `groupModel > dir: null `数据的排序方式 类似于sort 
> type array

```
groupModel: {
    dir: [ "up", "down", "up" ] // 第一列向上排序，第二列向下排序，第三列向上排序
}
```

#### `groupModel > icon` jqueryui样式图标 
> type: array

```
groupModel: {
    icon: [ [ "ui-icon-triangle-1-s" , "ui-icon-triangle-1-e" ], [ "ui-icon-minus" , "ui-icon-plus" ] ]
}
```

#### `groupModel > title` 组分类标题
> type: array
```
groupModel: {
    title: [ "<b class='pq-order-title'>{0} - {1} order(s)</b>", "{0} - {1} item(s)" ]
}
``` 

### hoverMode:'row' 鼠标悬浮模式
> type: string

>value:cell、row

### minWidth:50 最小宽度
> type: Integer

### numberCell: object 序号列模式
> type: object
```
(默认值)
numberCell: {   
    show: true,    // 显示序号列
    width: 30,    // 表格序号列宽度 
    minWidth: 30,
    title: '',    // 表格序号列表头
    resizable: false,   // 不能调整宽度
}
```

### pageModel: object  表格翻页模式设置

```
(默认值)
pageModel: {
    type: 'local',
    curPage: 1,
    rPP: 10,
    rPPOptions: [10, 20, 50, 100],
    totalPages: 22
}
```

#### `pageModel > type: null`  表格分页模式
> type: String

> value: local、remote

#### `pageModel > curPage: 0` 当前页
> type:  Integer

#### `pageModel > rPP: 10` 每页数据条数设置
> type:  Integer

#### `pageModel >  rPPOptions: [10, 20, 50, 100]` 每页数据条数设置
> type:  Integer

#### `pageModel > totalPages: 0` 分页模式 总页数
> type: Integer

### resizable：false 表格高宽是否可拉伸
> type: boolean

### roundCorners: true 表格边框是否圆角
> type: boolean

### selectionModel: obj  选择模块
```
(默认值)
selectionModel: {
    type: "cell", // "row"、"cell"、null
    cbHeader: null         // 表头复选框是否显现
}
```

### showBottom、showHeader、showTop、showTitle、showToolbar：true  是否展现底部(分页器)、表头、表格头部(toolbar与title)、标题、工具栏
> type: boolean

### sortable: true 使用排序
> type: boolean

### stripeRows: true 奇偶行样式开启
> type: boolean

### title: null 设置表格标题
> type: String

### toolbar: obj 工具栏模块
> type: obj

eg:
```
toolbar: {
    cls: "",
    items: [
        {
            type: 'button',
            label: 'Add', // 按钮文字
            icon: '...',
            listeners:[{ // 事件监听
                click: clickFn
            }]
        }
    ]
}
```
eg:

>	常用icon图标所对应的字符串 

|      | icon |
| :---- | :------: |
| 添加 | plus/add |
| 添加(加粗) | plusthick/add2 |
| 添加(圆圈背景) | circle-plus/add3 |
| 关闭 | close |
| 关闭(加粗) | closethick/close2 |
| 关闭(圆圈背景) | circle-close/close3 |
| 删除 | minus/delete |
| 删除 | minusthick/delete2 |
| 删除(圆圈背景) | circle-minus/delete3 |
| 返回/撤销 | arrowreturn-1-w/back |
| 返回(加粗) | arrowreturnthick-1-w/back2 |
| 清空 | trash/clean |
| 取消/禁用 | cancel |
| 查询 | search |
| 设置 | gear/settings |
| 确认/保存 | check/audit |
| 计算 | calculator/counter |
| 确认(圆圈背景) | circle-check/audit2 |
| 保存 | disk/save |
| 导出 | arrowstop-1-n/export |
| 导出(加粗) | arrowthickstop-1-n/export2 |
| 文档 | document |
| 下载/导入 | arrowstop-1-s/import |
| 下载(加粗) | arrowthickstop-1-s/import2 |
| 打印 | print |
| 复制 | copy |
| 刷新 | refresh |
| 刷新 | arrowrefresh-1-w/refresh2 |
| 帮助 | help |

### wrap: true 文本换行，溢出隐藏，变为...
> type: boolean

### summary:obj 固定摘要行 (前台渲染摘要行数据)
> 像合计行一样悬浮在表格底部 (前台计算合计、平均值等) 
> type: object


eg:
```
    summary:{         //  摘要行集合
        totalColumns:['revenues','profits'],
        keyWordCol:'rank',   //关键字所在列的列名
        averageColumns:['revenues','profits'],
        maxColumns:['revenues','profits'],
        minColumns:['revenues','profits']
    }

    // 以上数组的元素都是column里的name
```

### summaryRowIndx:[index1, index2,...] (后台渲染摘要行数据)
> 从后台返回的数据中通过给出的索引取出合计的数据 单独渲染到表格底部

> 与 summary属性不同，不能同时存在

### addRowByKey:true   down方向键、tab键 控制添加行
> type: boolean

## 事件
### beforeSort(event, ui)
> 排序前事件，返回false取消排序

### beforeTableView(event, ui)
> 在表格数据即将呈现之前触发，只能用于更新，不能插入或删除

### beforeValidate(event, ui)
> 表格数据更改之前，验证事件之前。

>引用所有ui参数，修改参数会影响表格后续数据处理

### cellBeforeSave(event, ui)
> 单元格保存之前触发。返回false取消数据保存

### cellClick(event, ui) 单元格点击
> 单元格点击事件

### cellDblClick(evnet, ui) 单元格双击
> 单元格双击

### cellKeyDown(event, ui)
> 选中单元格时按键触发。多选，在最后单元格接受输入。返回false可以防止grid默认处理

### cellRightClick(event, ui) 单元格右击
> 单元格右键事件

### cellSave(event, ui) 
> 单元格本地保存后触发。适用于更细其他单元格中的计算或依赖数据

### cellSelect(event, ui) 单元格选择
> 选择单元格时触发

### cellUnselect(event, ui) 单元格取选
> 单元格取消选择时触发

### change(event, ui) 数据改变
> 编辑完后数据变更触发。可以调用或粘贴行/单元格。撤销/重做/或提交/回滚来添加/更新/删除行 

>多处一起变更时触发一次。

### columnResize(event, ui)
> 调整列大小后触发

### create(event, ui) 表格创建
> grid创建后触发。

> 本地使用。远程使用load事件

### load(event, ui) 数据加载
> 加载数据后触发

### editorBegin(event, ui) 编辑前
> 创建编辑器时触发

### editorBlur(event, ui) 编辑失焦
> 编辑器失焦时触发

### editorEnd(event, ui) 编辑后
> 销毁时触发 (单元格编辑完事件)

### editorFocus(event, ui) 编辑聚焦
> 聚焦时触发

### editorKeyDown(event, ui)
> 定义键时触发。返回false防止编辑器默认行为

### editorKeyPress(event, ui)
> 按住时

### editorKeyUp(event, ui)
> 按键释放时

### headerCellClick(event, ui)列头点击
> 列头单击触发

### history(event, ui)历史
> 当触发type = add、 canUndo = true | false、 canRedo = true | false、 type = undo | redo、 type = reset | resetUndo时触发

### refresh(event, ui)刷新
> 刷新时触发

### refreshRow(event, ui)刷新行
> refreshRow()方法执行,行刷新时触发

### render(event, ui)重渲染
> DOM结构创建之后，完全初始化前触发。适用于添加工具栏等

### rowClick(event, ui)行点击
> 行点击后触发，在cellClick事件之后

### rowDblClick(event, ui)行双击
> 行双击，在cellDblClick事件后触发

### rowRightClick(event, ui)行右击
> 右键单击触发

### rowSelect(event, ui)行选择
> 行选择时触发

### rowUnSelect(event, ui)行取选
> 行取消选择触发

### selectChange(event, ui)改变选择
> 操作更改选择，或通过调用选择方法触发

### sort(event, ui)
> 排序后触发

### changeRow(event, obj)换行
> 换行事件 (该事件只在键盘回车换行时执行)

> 参数: 鼠标属性 、 包含prevR与nowR属性的对象 

> 返回值为 false时 阻止跳转

## 方法

> 约定
> 加粗为必填

### `setEvent(eventname, callback)`设置事件

- **eventname**
	Type: String
	事件名
	click、mousedown...
- **callback**
	Type: Function
	回调函数

### `addRowClass(rowIndx, cls)` 行添加class ###

- **rowIndx**
	Type: number
	行索引
- **cls**
	Type: String (不加点的字符串)
	判断的class，空格分割可添加多个

### `addCellClass(rowIndx, dataIndx, cls)` 给单元格添加class ###

- **rowIndx**
	Type: number
	行索引
- **dataIndx**
	Type: Number/String
	键名或数组索引
- **cls**
	Type: String (不加点的字符串)
	判断的class

### `addRow(obj, isFlip)` 添加数据行 ###

> 末尾添加数据行
> 不填数据则加空行
> 添加行可以翻滚页面至对应行

- obj
	Type:  object
	行数据对象。
- isFlip(默认值: true)
	Type: Boolean

### `insertRow(rowIndx, obj, isFlip)`插入行 ###

> 指定行，插入数据行
> 不填则在前面添加空行
> 添加行可以翻滚页面至对应行
- rowIndx
	Type: number
	行号
- obj
	Type: object
	行数据对象
- isFlip(默认值: true)
	Type: Boolean

### `collapse()`  折叠grid ！ ###

### `createTable($cont, data)`  ###

> 生成类似表结构，同步表。底部创建冻结列，合计等，很有用

- **$cont**
	Type:  Jquery obj
	容器
	e.g. `$(<div></div>)`
	
- **data**
	Type: array
	与表数据对应的 键值对对象 数组

### `deleteRow(rowIndx)` 删除行 ###

- **rowIndx**
	Type: number
	行索引
	
### `deleteSelectedRows()` 删除选中行 ###


### `destroy()` 销毁 ###

> 销毁真个gird

### `disable()` 禁用 ###

### `editCell(rowIndxPage, dataIndx, isInAll)` 选定单元格开始编辑，聚焦 ###

- **rowIndxPage**
	Type:  Number
	当前页行索引
	
- **dataIndx**
	Type:  string/number
	单元格的name或列索引
	
- isInAll
	Type:  boolean
	如果isInAll为true时，rowIndxPage变所有数据的行索引

### `editFirstCellInRow(rowIndx)` 可编辑模式下 选定行第一个可编辑单元格开始编辑 ###

- **rowIndx**
	Type: number

### `expand()` 展开表格 ！ ###

### `filter(oper, data)` 过滤数据 ###

- **oper**
	Type: string
	'replace'替换原有过滤/'add'添加条件，dataIndx相同则替换条件
	'replace' / 'add'
	
- **data**
	Type:  Array
	过滤数组，[键入{ dataIndx: 列索引或键名， condition: 过滤条件，value: 过滤的值，value2: 第二值 }]

### `getCell(rowIndx, dataIndx, isInAll)` 获取单元格 ###

- **rowIndx**
	Type: number
	当前页索引
	
- **dataIndx**
	Type: number/string
	单元格name，或列索引
	
- isInAll
	Type:  boolean
	true，rowIndx变成所有数据的行索引

### `getCellsByClass(cls)` 根据class获取单元格 ###

- **cls**
	Type:  string
	单元格class名
	
### `getCellIndices($td)` 获取单元格索引 ###

- **$td**
	Type:  jq obj
	单元格jquery对象
	
### `getChanges(format)` 获得改变的数据 ###

> 获取 未提交的，添加，更新，删除的行。(执行此方法时必须开启swipeModel{on:true},与obj.dataModel.recIndx)
> 返回

- **format**
	Type: String
	不填，返回引用的rowData，填"byVal"，克隆再返回
	'byVal'
	
### `getColIndx(dataInx)` 根据键名获取列索引 ###

- **dataInx**
	Type: string
	列名
	
### `getColumn(dataIndx)` 获取列信息 ###

- **dataIndx**
	Type: string
	列

### `getColumns()` 获取columns ###

### `getData(colNameArr)` 获取指定数据 ###

> 根据列名数组，返回行对象数组
> 返回

- **colNameArr**
	Type: array
	列名数组
	
### `getEditCell()` 返回当前编辑单元格 ###

### `getEditCellData()` 返回当前编辑单元格关联的数据 ###

### `getInstance()` 返回表格实例 ###

### `getRowNode(rowIndxPage)` 获取行节点 ###

- **rowIndxPage**
	Type: number
	当前页行索引
	
### `getRowData(rowindx, isInAll)` 获取行数据 ###

- **rowindx**
	Type:  Number
	当前行索引
	
- **isInAll**
	Type: Boolean
	如果true是所有数据的索引
	
### `getRowIndx($tr)` 获取行索引 ###

- **$tr**
	Type:  jq obj
	行的jquery对象
	
### `getRowsByClass(cls)` 返回行数据对象数组 ###

- **cls**
	Type:  String
	行class
	
### `goToPage(pageNum)` 翻页，跳转指定页面 ###

- **pageNum**
	Type: Number
	指定页数

### `hasRowClass(rowIndx, cls)` 判断行有没有对应class ###

- **rowIndx**
	Type: number
	行索引
	
- **cls**
	Type: String
	判断的class
	
### `hasCellClass(rowIndx, dataIndx, cls)` 判断单元格有没有class ###

- **rowIndx**
	Type: number
	行索引
	
- **dataIndx**
	Type: Number/String
	键名或数组索引
	
### `hideLoading()` 隐藏加载图表 ###

### `history(method)` 操作历史记录 ###

> method是canUndo或canRedo时返回

- **method**
	Type: String
	undo：反向添加更新删除, 
	redo：重复添加更新删除先前反转的操作, 
	canUndo：返回布尔值，是否可以执行进一步的撤销操作, 
	canRedo：返回布尔值，是否可以重复执行操作,
	 reset：清楚历史记录，不进行任何操作

### `isDirty(rowData)` 判断提交后数据是否有变化 ###

- rowData
	Type: Srtng/number
	不填查所有。或填入行索引或行数据逐行查询

### `isEditableCell(rowIndx, dataIndx)` 判断是否可编辑 ###

- **rowIndx**
	Type: Number
	行索引
	
- **dataIndx**
	Type: Number/String
	数据数组索引，或键名
	
### `isEditableRow(rowIndx)` 判断行是否可编辑 ###

- **rowIndx**
	Type: Number
	行索引
	
### `isRowValid(rowIndx, allowInvalid)` 检查行是否对column.validations []有效 ###

> 返回

- **rowIndx**
	Type: number/obj/arry
	行信息
	
- **allowInvalid**
	Type: Boolean
	为true时允许无效，返回无效集合。
	false，不允许无效，跳到第一个无效单元格，返回第一个单元格无效信息
	
### `isRowArrayValid(data, allowInvalid)` 检查行集合是否对column.validations []有效 ###

> 返回

- **data**
	Type: arry
	行信息集合
	
- **allowInvalid**
	Type: Boolean
	
### `isCellValid(rowIndx, dataIndx, allowInvalid)` 检查单元格是否对column.validations []有效 ###

- **rowIndx**
	Type: number
	行索引
	
- **dataIndx**
	Type: number、string
	列name或数据索引

- **allowInvalid**
	Type: Boolean
	
### `quitEditMode()` 忽略编辑单元格未保存的更改，并退出编辑模式 ###


### `option(optionName, value)`配置选项 ###

> 返回表格的设置选项
> 返回。

- **optionName**
	Type: string/object
	不填：值返回当前grid设置对象，
	object：{optionName: value},增加设置
	
- **value**
	Type: 
	上个参数为string时，不填：返回对应设置的值。填：修改对应设置
	
### `refresh()`刷新 ###

> 刷新，更改dataModel，或更新记录时很有用

### `refreshCell(rowIndx, dataIndx, isInAll)`刷新单元格 ###

> 刷新单元格

- **rowIndx**
	Type: Number
	当前页面索引
	
- **dataIndx**
	Type: Number，String
	数据索引，或键名

- **isInAll**
	Type: Boolean
	
	
### `refreshColumn(dataIndx)`刷新列 ###

> 刷新列

- **dataIndx**
	Type: Number/string
	数据索引，或键名

### `refreshDataAndView()`刷新视图和数据 ###

> 刷新数据，也会重新加载后台数据。更改dataModal属性，或添加，删除更新记录后很有用。避免循环
	
### `refreshHeader()`刷新列头 ###

> 刷新列标题

### `refreshRow(rowIndx, isInAll)`刷新行 ###

> 刷新行

- **rowIndx**
	Type: Number
	当前页行索引
	
- **isInAll**
	Type: boolean
	
### `refreshView()`刷新视图 ###

> 刷新视图。更改dataModel或添加，删除，更新记录后很有用
	
### `removeRowClass(rowIndx, cls)` 移除行class ###

- **rowIndx**
	Type: number
	行索引
	
- **cls**
	Type: String
	删除的class，可以空格分割来删除多个class
	
### `removeCellClass(rowIndx, dataIndx, cls)` ###

> 

- **rowIndx**
	Type: number
	行索引
	
- **dataIndx**
	Type: Number/String
	键名或数组索引
	
- **cls**
	Type: String
	删除的class，可以空格分割来删除多个class
	
	
### `rollback(type)`回滚 ###

> 打开跟踪后，可以撤销添加，编辑，删除操作

- **type**
	Type: string
	撤销类型
	"add", "update", "dalete"
	
### `rowCollapse(rowIndx, isInAll)` 折叠对应视图 ###

- **rowIndx**
	Type: Number
	当前页行索引
	
- **isInAll**
	Type: Boolean
	填入并true时，所有数据行索引
	
### `rowExpand(rowIndx, isInAll)` 展开对应视图 ###

- **rowIndx**
	Type: Number
	当前页行索引
	
- **isInAll**
	Type: Boolean
	填入并true时，所有数据行索引
	
### `rowInvalidate(rowIndx, isInAll)` ###

> 从视图和缓存中删除该行的详细视图 ，网络错误导致视图无法加载可能有用！

- **rowIndx**
	Type: Number
	当前页行索引
	
- **isInAll**
	Type: Boolean
	填入并true时，所有数据行索引
	
### `saveEditCell()` 保存当前编辑单元格 ###

> 返回操作结果

### `scrollColumn(dataIndx)` 水平滚动视图 ###

- **dataIndx**
	Type: Number/string
	列名name或数据数组索引
	
### `scrollRow(rowIndxPage)` 垂直滚动视图 ###

- **rowIndxPage**
	Type: Number
	当前页行索引
	
### `selectRemove(rowIndx)` 从选择集中移除指定行数据 ###

### `selectRemoveAll()` 删除所有选择数据 ###

### `selectAdd(rowIndx，dataIndx)`添加选择 ###

> 从选择集中添加指定行数据

- **rowIndx**
	Type: number
	行索引
- dataIndx (精确到单元格选择)
    Type: string


### `selectGet(type)`获取选择行 ###

> 获取选择数据集  
> type 默认值为 row
> 有返回值

- type
  Type: string
  "row"、 "cell"。

### `selectGetChecked()`  获取复选框勾选时的选择数据 ###

> 返回

### `setSelection(rowIndx, focus，isInAll)` 根据参数选择行、单元格 ###

- **rowIndx**
	Type:Number
	当前页行索引

- **isInAll**
 Type: boolean
 true时，所有数据行索引。

- focus (默认值: false)
    Type: boolean

### `showLoading()` 显示loading。异步操作时很有用 ###

### `undo()`撤销 ###

> 撤销添加，更新，删除操作。可以被多次调用 ！
 
### `updateRow(rowIndx, rowdata)`更新行 ###

- **rowIndx**
	Type:number
	行索引

- **rowdata**
 Type: object
 行数据
 
### `widget()` 返回包含表格的jquery对象 ###

--------

### `loadData(parms, url)` 重加载 ###

- **parms**
	Type:obj
	ajax 参数

- url
 Type: string
 ajax url
 
### `getUrlParms()` 获取远程请求时的字段 ###

> 返回parms对象
  
### `getAllData()` 获取所有数据 ###

  
### `getDataInPage()` 获取当前页数据 ###


### `deleteRows(arr)` 删除多行 ###

- **arr**
	Type:array
	行数据集合 eg: [{rowIndx:...,}]

### `deleteSelectedRow()` 删除选中行 ###

### `toggleCol(columnname, isShow)` 显示隐藏列 ###

- **columnname**
	Type:string
	列名
	
- **isShow**
 Type: Boolean
 是否显示
  
### `setDisabledTB(itemid)` 设置toobar 按钮置灰 ###

- **itemid**
	Type:string
	button item中 item.id值

### `setEnabledTB(itemid)` 设置toobar 按钮不置灰 ###

> 
- **itemid**
	Type:string
	button item中 item.id值

### `getUpdated()` 获取修改数据 ###

### `getAdded()` 获取添加数据 ###
 

### `getDeleted()` 获取删除数据 ###


### `refreshSummary()`刷新摘要(合计)行 ###


### `getTotalSummary(columns)`获取合计数据 ###

- columns
  type: 'string' / 'array'
  列名或列名数组
  返回
  获取合计行的对应数据

### `getSummaryDatas()` 获取摘要行数据 ###

- 所有的摘要行数据

### `getColsByLevel(columnLevel)` 根据列层次获取列集合 ###

- 根据列层次获取列集合


### `getPrintColumns()` 获取表格打印格式的表头列 ###

- 获取表格打印格式的表头列

### `getColsByLevel(columnLevel)` 根据列层次获取列集合 ###
- columnLevel:
    type: 'number'
    列层级 
    根据列层次获取列集合

### `addRowByDefault(rowData)` 添加默认值的新行 ###

- 根据列信息中的is_default default_value default_text，添加行的时候附加默认值
- 当只有is_default date默认选当天 select默认选第一个
- 注意这里的判断，当有keyField, keyField为default_value，否则name为default_value
- rowData:
    type: object

### `validateTest(param)` 表格验证 ###

- param:
    Type: object
    eg:
    ```
    param: {
        required: {
            columnName1: true,
            columnName2: true,
            columnName3: true,
        },
        type: {
            columnName1: 'number',
            columnName2: 'string',
        },
        test: {
            columnName2: /^d+/
        }
    }
    ```

### `changeHeaderText(dataIndx, title)` 更新grid表头指定列的列名 ###

- **dataIndx**
    Type: string/number
- **title**
    Type: string