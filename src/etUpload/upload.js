/**
 * 创建空标签
 */
function buildEmpty() {
    const $emptyView = $('<li class="view-item"><div class="default">+</div></li>');
    const $emptyFile = $('<li></li>').append('<input class="" type="file">');
    return { $emptyView, $emptyFile };
}

/**
 * 添加占位块
 * @param {object}
 * @ulView 预览容器
 * @ulFile 文件容器
 */
function insertFile({ $ulView, $ulFile }) {
    const { $emptyView, $emptyFile } = buildEmpty();
    $ulView.append($emptyView);
    $ulFile.append($emptyFile);
}

/**
 * 填充待上传图片
 * @param {object}
 * @file 待上传文件
 * @index 位置索引
 * @$ulView 预览容器
 */
function insertView({ file, index, $ulView }) {
    const $image = $('<img src=""/>');
    const $li = $ulView.find('li').eq(index).html('');
    $li.addClass('view-image');
    $li.append($image);
    $li.append('<div class="mask"><span class="show">查看</span><span class="delete">移除</span></div>');
    const reader = new FileReader();
    reader.onloadend = function () {
        $image.attr('src', reader.result);
    };

    if (file) {
        reader.readAsDataURL(file);
    } else {
        $image.attr('src', '');
    }
    return $image;
}

/**
 * 填充默认值
 * @param {object}
 */
function insertViewList({
    $ulView, $ulFile, srcList, fileList, multiple
}) {
    $ulView.html('');
    $ulFile.html('');
    fileList.length = 0;
    srcList.forEach((v, i) => {
        if (v === 'undefined') {
            if ($ulView.find('li').length < 1) {
                insertFile({ $ulView, $ulFile });
            }
            return;
        }
        fileList.push(v);
        const $image = $(`<img src="${v}"/>`);
        const $li = $('<li class="view-item view-image"></li>');
        $li.append($image);
        $li.append('<div class="mask"><span class="show">查看</span><span class="delete">移除</span></div>');
        $ulView.append($li);
        $ulFile.append('<li></li>');
    });
    multiple && insertFile({ $ulView, $ulFile });
}


function initPreView() {
    const $div = $('<div style="display:none"></div>');
    const $preView = $('<div class="preView"></div>');
    const $imgDiv = $('<div class="preView-image"><img src=""></div>');
    $div.append($preView);
    $div.append($imgDiv);
    return $div;
}

function render($main, options) {
    const fileList = [];
    const { height, width, multiple } = options;
    $main.addClass('etUpload-multiple');
    const $ulView = $('<ul class="upload-preView"></ul>');
    const $ulFile = $('<ul class="upload-file"></ul>');
    const $preView = initPreView();


    insertFile({ $ulView, $ulFile });

    $ulFile.on('change', 'input:file', (e) => {
        const file = e.target.files[0];
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(e.target.value)) {
            alert('文件类型必须是图片！');
            return;
        }
        fileList.push(file);
        const index = $ulFile.find('li').index(e.target.parentNode);
        // 填充待上传图片
        insertView({ file, index, $ulView });
        // 添加新的空文件
        multiple && insertFile({ $ulView, $ulFile });
    });

    $ulView.on('click', '.default', (e) => {
        const index = $ulView.find('li').index(e.target.parentNode);
        const $file = $ulFile.find('li').eq(index).find('input:file');
        $file.click();
    });

    $ulView.on('click', '.mask', (e) => {
        const curLi = e.target.parentNode.parentNode;
        const index = $ulView.find('li').index(e.target.parentNode.parentNode);
        if ($(e.target).attr('class') === 'show') {
            const src = $(curLi).find('img').attr('src');
            $preView.show().find('img').attr('src', src);
        } else if ($(e.target).attr('class') === 'delete') {
            $ulView.find('li').eq(index).remove();
            $ulFile.find('li').eq(index).remove();
            fileList.splice(index, 1);
            // 如果没有空视图 则添加一条
            if ($ulView.find('li').length < 1) {
                insertFile({ $ulView, $ulFile });
            }
        }
    });

    $preView.click(() => {
        $preView.hide();
    });

    $main.append($ulView).append($ulFile);
    $main.append($preView);
    const result = {
        getValues: function () {
            return fileList;
        },
        getValue: function () {
            return fileList[0];
        },
        setValues: function (srcList) {
            insertViewList({
                $ulView, $ulFile, srcList, fileList, multiple
            });
        },
        setValue: function (src) {
            const srcList = [src];
            insertViewList({
                $ulView, $ulFile, srcList, fileList, multiple
            });
        }
    };
    return result;
}

export default render;