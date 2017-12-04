const defaultOptions = {
    // group: "name",  // or { name: "...", pull: [true, false, clone], put: [true, false, array] }
    // sort: true,  // sorting inside list
    // delay: 0, // time in milliseconds to define when the sorting should start
    // disabled: false, // Disables the sortable if set to true.
    // store: null,  // @see Store
    animation: 100, // ms, animation speed moving items when sorting, `0` — without animation
    handle: '.handle', //
    height: 200,
    data: [], // 数据
    columns: [], // 列头
    dragHandle: false, // 是否可拖拽
    checkbox: true, // 是否存在复选框
    filter: '.column' // 拖拽列
    // preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
    // draggable: ".item",  // Specifies which items inside the element should be draggable
    // ghostClass: "sortable-ghost",  // Class name for the drop placeholder
    // chosenClass: "sortable-chosen",  // Class name for the chosen item
    // dragClass: "sortable-drag",  // Class name for the dragging item
    // dataIdAttr: 'data-id',

    // forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

    // fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
    // fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
    // fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

    // scroll: true, // or HTMLElement
    // scrollFn: function (offsetX, offsetY, originalEvent) { ... }, // if you have custom scrollbar scrollFn may be used for autoscrolling
    // scrollSensitivity: 30, // px, how near the mouse must be to an edge to start scrolling.
    // scrollSpeed: 10, // px

    // setData: function (/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
    //     dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
    // },

    // // Element is chosen
    // onChoose: function (/**Event*/evt) {
    //     evt.oldIndex;  // element index within parent
    // },

    // // Element dragging started
    // onStart: function (/**Event*/evt) {
    //     evt.oldIndex;  // element index within parent
    // },

    // // Element dragging ended
    // onEnd: function (/**Event*/evt) {
    //     var itemEl = evt.item;  // dragged HTMLElement
    //     evt.to;    // target list
    //     evt.from;  // previous list
    //     evt.oldIndex;  // element's old index within old parent
    //     evt.newIndex;  // element's new index within new parent
    // },

    // // Element is dropped into the list from another list
    // onAdd: function (/**Event*/evt) {
    //     // same properties as onEnd
    // },

    // // Changed sorting within list
    // onUpdate: function (/**Event*/evt) {
    //     // same properties as onEnd
    // },

    // // Called by any change to the list (add / update / remove)
    // onSort: function (/**Event*/evt) {
    //     // same properties as onEnd
    // },

    // // Element is removed from the list into another list
    // onRemove: function (/**Event*/evt) {
    //     // same properties as onEnd
    // },

    // // Attempt to drag a filtered element
    // onFilter: function (/**Event*/evt) {
    //     var itemEl = evt.item;  // HTMLElement receiving the `mousedown|tapstart` event.
    // },

    // // Event when you move an item in the list or between lists
    // onMove: function (/**Event*/evt, /**Event*/originalEvent) {
    //     // Example: http://jsbin.com/tuyafe/1/edit?js,output
    //     evt.dragged; // dragged HTMLElement
    //     evt.draggedRect; // TextRectangle {left, top, right и bottom}
    //     evt.related; // HTMLElement on which have guided
    //     evt.relatedRect; // TextRectangle
    //     originalEvent.clientY; // mouse position
    //     // return false; — for cancel
    // },

    // // Called when creating a clone of element
    // onClone: function (/**Event*/evt) {
    //     var origEl = evt.item;
    //     var cloneEl = evt.clone;
    // }
};

export default defaultOptions;