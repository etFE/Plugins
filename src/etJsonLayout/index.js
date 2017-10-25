import './style/main.css';
import Collapsed from './style/Collapsed.gif';
import Expanded from './style/Expanded.gif';

const defaultOptions = {
    TAB: '    ', // 缩进
    ImgCollapsed: Collapsed,
    ImgExpanded: Expanded,
    QuoteKeys: true,
    IsCollapsible: true,
    JSONSTRING: ''
};

// defaultOptions.TAB = '    ';// 缩进
// // 打开收起图片
// defaultOptions.ImgCollapsed = Collapsed;
// defaultOptions.ImgExpanded = Expanded;

// defaultOptions.QuoteKeys = true; // 引号
// defaultOptions.IsCollapsible = true; // 是否显示展开按钮

// defaultOptions.JSONSTRING = '';


function IsArray(obj) {
    const isArr = Object.prototype.toString.call(obj) === '[object Array]';
    return isArr;
}

function GetRow(indent, data, isPropertyContent) {
    let tabs = '';
    for (let i = 0; i < indent && !isPropertyContent; i++) tabs += defaultOptions.TAB;
    if (data != null && data.length > 0 && data.charAt(data.length - 1) !== '\n') {
        data = `${data}\n`;
    }
    return tabs + data;
}

function FormatLiteral(literal, quote, comma, indent, isArray, style) {
    if (typeof literal === 'string') {
        literal = literal.split('<').join('&lt;').split('>').join('&gt;');
    }
    let str = `<span class='${style}'>${quote + literal + quote + comma}</span>`;
    if (isArray) str = GetRow(indent, str);
    return str;
}

function FormatFunction(indent, obj) {
    let tabs = '';
    for (let i = 0; i < indent; i++) tabs += defaultOptions.TAB;
    const funcStrArray = obj.toString().split('\n');
    let str = '';
    for (let i = 0; i < funcStrArray.length; i++) {
        str += `${((i === 0) ? '' : tabs) + funcStrArray[i]}\n`;
    }
    return str;
}

function ProcessObject(obj, indent, addComma, isArray, isPropertyContent) {
    let html = '';
    let clpsHtml = '';
    const comma = (addComma) ? '<span class="Comma">,</span> ' : '';
    const type = typeof obj;
    if (IsArray(obj)) { // 判断数组
        if (obj.length === 0) {
            html += GetRow(indent, `<span class="ArrayBrace">[ ]</span>${comma}`, isPropertyContent);
        } else {
            clpsHtml = defaultOptions.IsCollapsible ? `<span><img src="${defaultOptions.ImgExpanded}" onClick="ExpImgClicked(this)" /></span><span class='collapsible'>` : '';
            html += GetRow(indent, `<span class='ArrayBrace'>[</span>${clpsHtml}`, isPropertyContent);
            for (let i = 0; i < obj.length; i++) {
                html += ProcessObject(obj[i], indent + 1, i < (obj.length - 1), true, false);
            }
            clpsHtml = defaultOptions.IsCollapsible ? '</span>' : '';
            html += GetRow(indent, `${clpsHtml}<span class='ArrayBrace'>]</span>${comma}`);
        }
    } else if (type === 'object') { // 判断对象
        if (obj == null) {
            html += FormatLiteral('null', '', comma, indent, isArray, 'Null');
        } else if (obj.constructor === new Date().constructor) {
            html += FormatLiteral(`new Date("${obj.getTime()}") /*"${obj.toLocaleString()}"*/`, '', comma, indent, isArray, 'Date');
        } else if (obj.constructor === new RegExp().constructor) {
            html += FormatLiteral(`new RegExp(${obj})`, '', comma, indent, isArray, 'RegExp');
        } else {
            const numProps = Object.keys(obj).length;
            // for (let prop in obj) numProps++;
            if (numProps === 0) {
                html += GetRow(indent, `<span class='ObjectBrace'>{ }</span>${comma}`, isPropertyContent);
            } else {
                clpsHtml = defaultOptions.IsCollapsible ? `<span><img src="${defaultOptions.ImgExpanded}" onClick="ExpImgClicked(this)" /></span><span class='collapsible'>` : '';
                html += GetRow(indent, `<span class='ObjectBrace'>{</span>${clpsHtml}`, isPropertyContent);

                Object.keys(obj).forEach((prop, index) => {
                    const quote = defaultOptions.QuoteKeys ? '"' : '';
                    html += GetRow(indent + 1, `<span class='PropertyName'> ${quote + prop + quote}</span>:${ProcessObject(obj[prop], indent + 1, index < numProps, false, true)}`);
                });

                clpsHtml = defaultOptions.IsCollapsible ? '</span>' : '';
                html += GetRow(indent, `${clpsHtml}<span class='ObjectBrace'>}</span>${comma}`);
            }
        }
    } else if (type === 'number') {
        html += FormatLiteral(obj, '', comma, indent, isArray, 'Number');
    } else if (type === 'boolean') {
        html += FormatLiteral(obj, '', comma, indent, isArray, 'Boolean');
    } else if (type === 'function') {
        if (obj.constructor === new RegExp().constructor) {
            html += FormatLiteral(`new RegExp(${obj})`, '', comma, indent, isArray, 'RegExp');
        } else {
            obj = FormatFunction(indent, obj);
            html += FormatLiteral(obj, '', comma, indent, isArray, 'Function');
        }
    } else if (type === 'undefined') {
        html += FormatLiteral('undefined', '', comma, indent, isArray, 'Null');
    } else {
        html += FormatLiteral(
            obj.toString()
                .split('\\')
                .join('\\\\')
                .split('"')
                .join('\\"'), '"',
            comma,
            indent,
            isArray,
            'String'
        );
    }
    return html;
}

function initFormat(element, jsonString) {
    if (jsonString) {
        defaultOptions.JSONSTRING = jsonString;
    }
    if (element) {
        defaultOptions.ELEMENT = element;
    }
    const json = defaultOptions.JSONSTRING;
    const dom = defaultOptions.ELEMENT;
    const jsonObj = JSON.parse(json);
    const html = ProcessObject(jsonObj, 0, false, false, false);
    const codeComtainer = `<PRE class='CodeContainer'>${html}</PRE>`;
    dom.innerHTML = codeComtainer;
}

function QuoteKeysClicked(show) {
    defaultOptions.QuoteKeys = show;
    initFormat();
}

function TraverseChildren(element, func, depth) {
    for (let i = 0; i < element.childNodes.length; i++) {
        TraverseChildren(element.childNodes[i], func, depth + 1);
    }
    func(element, depth);
}

function MakeContentVisible(element, visible) {
    const img = element.previousSibling.firstChild;
    if (!!img.tagName && img.tagName.toLowerCase() === 'img') {
        element.style.display = visible ? 'inline' : 'none';
        element.previousSibling.firstChild.src = visible ?
            defaultOptions.ImgExpanded : defaultOptions.ImgCollapsed;
    }
}

function CollapseAllClicked() {
    TraverseChildren(defaultOptions.ELEMENT, (element) => {
        if (element.className === 'collapsible') {
            MakeContentVisible(element, false);
        }
    }, 0);
}

function ExpandAllClicked() {
    TraverseChildren(defaultOptions.ELEMENT, (element) => {
        if (element.className === 'collapsible') {
            MakeContentVisible(element, true);
        }
    }, 0);
}

function ExpImgClicked(img) {
    const container = img.parentNode.nextSibling;
    if (!container) return;
    let disp = 'none';
    let src = defaultOptions.ImgCollapsed;
    if (container.style.display === 'none') {
        disp = 'inline';
        src = defaultOptions.ImgExpanded;
    }
    container.style.display = disp;
    img.src = src;
}

function CollapseLevel(level) {
    TraverseChildren(defaultOptions.ELEMENT, (element, depth) => {
        if (element.className === 'collapsible') {
            if (depth >= level) {
                MakeContentVisible(element, false);
            } else {
                MakeContentVisible(element, true);
            }
        }
    }, 0);
}

const Methods = {
    initFormat,
    ExpImgClicked,
    ExpandAllClicked,
    CollapseAllClicked,
    CollapseLevel,
    QuoteKeysClicked
};

Object.assign(window, Methods);

