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
function insertView({ file, index, $ulView, fileSrc }) {
    const $image = $(`<img src="${fileSrc || ''}"/>`);
    const $li = $ulView.find('li').eq(index).html('');
    $li.addClass('view-image');
    $li.append($image);
    $li.append('<div class="mask"><span class="show">查看</span><span class="delete">移除</span></div>');
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
            $image.attr('src', reader.result);
        };
        reader.readAsDataURL(file);
    }
}


function insertOtherFile({ file, index, $ulView, fileSrc }) {
    const fileName = fileSrc || file.name;
    const nameIndex = fileName.lastIndexOf('/');
    const typeIndex = fileName.lastIndexOf('.');
    const fileType = fileName.substr(typeIndex + 1);
    const title = fileName.substr(nameIndex + 1);
    const $i = $(`<i>${fileType}</i>`);
    const $li = $ulView.find('li').eq(index).html('');
    $li.css({ 'background-color': '#47a447' });
    $li.addClass('view-image');
    $li.append($i);
    $li.append(`<div class="mask"><span class="download" title="${title}">下载</span><span class="delete">移除</span></div>`);
}

function insertCommon({ index, $ulView, fileSrc, type }) {
    if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileSrc)) {
        if (type !== 'file') {
            return;
        }
        // 填充待上传文件
        insertOtherFile({ fileSrc, index, $ulView });
    } else {
        insertView({ fileSrc, index, $ulView });
    }
}

/**
 * 填充默认值
 * @param {object}
 */
function insertViewList({
    $ulView, $ulFile, srcList, fileList, multiple, type
}) {
    $ulView.html('');
    $ulFile.html('');
    fileList.length = 0;
    srcList.forEach((v, i) => {
        if (!v || v === 'undefined') {
            if ($ulView.find('li').length < 1) {
                insertFile({ $ulView, $ulFile });
            }
            return;
        }
        const $li = $('<li class="view-item view-image"></li>');
        $ulView.append($li);
        $ulFile.append('<li></li>');
        insertCommon({ index: i, $ulView, fileSrc: v, type });
        fileList.push(v);
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
    const { multiple, type } = options;
    $main.addClass('etUpload-multiple');
    const $ulView = $('<ul class="upload-preView"></ul>');
    const $ulFile = $('<ul class="upload-file"></ul>');
    const $preView = initPreView();

    insertFile({ $ulView, $ulFile });

    $ulFile.on('change', 'input:file', (e) => {
        const file = e.target.files[0];
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(e.target.value)) {
            if (type !== 'file') {
                alert('文件类型必须是图片');
                return;
            }
            const index = $ulFile.find('li').index(e.target.parentNode);
            // 填充待上传文件
            insertOtherFile({ file, index, $ulView });
        } else {
            const index = $ulFile.find('li').index(e.target.parentNode);
            // 填充待上传图片
            insertView({ file, index, $ulView });
        }
        // 添加新的空文件
        multiple && insertFile({ $ulView, $ulFile });
        // 将文件添加到文件对象中 便于获取
        fileList.push(file);
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
        } else if ($(e.target).attr('class') === 'download') {
            const src = $(curLi).find('img').attr('src');
            if (typeof fileList[index] === 'string') {
                window.location.href = fileList[index];
            } else {
                alert('该文件暂未上传到服务端');
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
                $ulView, $ulFile, srcList, fileList, multiple, type
            });
        },
        setValue: function (src) {
            const srcList = [src];
            insertViewList({
                $ulView, $ulFile, srcList, fileList, multiple, type
            });
        }
    };
    return result;
}

export default render;