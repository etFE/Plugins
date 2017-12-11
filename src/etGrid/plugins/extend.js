/*========================重写方法================================== */
(function ($) {
	$.paramquery.formatCurrency = function (val) {
		if (isNaN(val)) {
			return val
		}
		val = Math.round(val * 10) / 10;
		val = val + "";
		if (val.indexOf(".") == -1) {
			val = val + ".0"
		}
		var len = val.length;
		var fp = val.substring(0, len - 2),
			lp = val.substring(len - 2, len),
			arr = fp.match(/\d/g).reverse(),
			arr2 = [];
		for (var i = 0; i < arr.length; i++) {
			if (i > 0 && i % 3 == 0) {
				arr2.push(",")
			}
			arr2.push(arr[i])
		}
		arr2 = arr2.reverse();
		if (fp[0] == '-') { //  当值为负数时 返回负数  --(cl)
			arr2.unshift('-');
		}
		fp = arr2.join("");
		return fp + lp
	};


	var _pGenerateView = $.paramquery.cGenerateView.prototype;
	_pGenerateView._renderCell = function (objP, _dataCell) {
		var that = this.that,
			options = this.options,
			rowData = objP.rowData,
			column = objP.column,
			type = column.type,
			dataIndx = column.dataIndx,
			cellData = rowData[dataIndx];
		if (!rowData) {
			return
		}
		var dataCell;
		if (_dataCell != undefined) {
			dataCell = _dataCell
		} else {
			if (type == "checkBoxSelection") {
				if (rowData.disabledcheckbox) { //  disabledcheckbox有值时复选框不能选(cl)       
					dataCell = "<input type='checkbox' " + 'disabled' + " />";
				} else {
					dataCell = "<input type='checkbox' " + (cellData ? "checked='checked'" : "") + " />";
				}
			} else {
				if (type == "detail") {
					var DTM = options.detailModel;
					var hicon = (cellData && cellData.show) ? DTM.expandIcon : DTM.collapseIcon;
					dataCell = "<div class='ui-icon " + hicon + "'></div>"
				} else {
					dataCell = cellData
				}
			}
		}
		if (dataCell === "" || dataCell == undefined) {
			dataCell = "&nbsp;"
		}
		var str = "",
			TVM;
		if (objP.tree && (TVM = options.treeModel) && TVM.labelIndx == dataIndx) {
			var isLeaf = rowData.pq_leaf,
				level = rowData.pq_level,
				expanded = !rowData.pq_collapse,
				treeMarginLeft = (level + 1) * TVM.indent,
				leafClass = "";
			if (isLeaf) {
				leafClass = TVM.leafIcon
			} else {
				if (expanded) {
					leafClass = TVM.expandIcon + " pq-tree-expand-icon"
				} else {
					leafClass = TVM.collapseIcon + " pq-tree-expand-icon"
				}
			}
			var strTree = ["<div class='pq-tree-icon-container' style='width:", treeMarginLeft, "px;'>", "<div class='ui-icon ", leafClass, " pq-tree-icon' ></div></div>"].join("");
			str = "<div class='" + cls + "'>" + strTree + dataCell + "</div>"
		} else {
			str = dataCell
		}
		return str
	};

	var _pUCData = $.paramquery.cUCData.prototype;
	_pUCData.add = function (obj) {
		var that = this.that,
			adata = this.adata,
			rowData = obj.rowData,
			TM = this.options.trackModel,
			dirtyClass = TM.dirtyClass,
			recId = that.getRecId({
				rowData: rowData
			});
		for (var i = 0, len = adata.length; i < len; i++) {
			var rec = adata[i];
			/*******注释 下面的判断条件影响其添加数据导致报错 ---(cl)************ */
			/* if (recId != null && rec.recId == recId ) {   
				throw ("primary key violation")
			} */
			/************************************ */
			if (rec.rowData == rowData) {
				throw ("same data can't be added twice.")
			}
		}
		var dataIndxs = [];
		for (var dataIndx in rowData) {
			dataIndxs.push(dataIndx)
		}
		that.removeClass({
			rowData: rowData,
			dataIndx: dataIndxs,
			cls: dirtyClass
		});
		var obj = {
			recId: recId,
			rowData: rowData
		};
		adata.push(obj)
	};
	_pUCData.update = function (objP) {
		var that = this.that,
			TM = this.options.trackModel,
			dirtyClass = TM.dirtyClass,
			rowData = objP.rowData || that.getRowData(objP),
			recId = that.getRecId({
				rowData: rowData
			}),
			dataIndx = objP.dataIndx,
			refresh = objP.refresh,
			columns = that.columns,
			getVal = $.paramquery.getValueFromDataType,
			newRow = objP.row,
			udata = this.udata,
			newudata = udata.slice(0),
			_found = false;
		/* if (recId == null) {
			return
		} */
		for (var i = 0, len = udata.length; i < len; i++) {
			var rec = udata[i],
				oldRow = rec.oldRow;
			if (rec.rowData == rowData) {
				_found = true;
				for (var dataIndx in newRow) {
					var column = columns[dataIndx];
                    if(!column) {   // 下拉子表格更新父表格数据时 数据会有列名以外的字段 及排除
                        break;
                    }
					var dataType = column.dataType,
						newVal = newRow[dataIndx],
						newVal = getVal(newVal, dataType),
						oldVal = oldRow[dataIndx],
						oldVal = getVal(oldVal, dataType);
					if (oldRow.hasOwnProperty(dataIndx) && oldVal === newVal) {
						var obj = {
							rowData: rowData,
							dataIndx: dataIndx,
							refresh: refresh,
							cls: dirtyClass
						};
						that.removeClass(obj);
						delete oldRow[dataIndx]
					} else {
						var obj = {
							rowData: rowData,
							dataIndx: dataIndx,
							refresh: refresh,
							cls: dirtyClass
						};
						that.addClass(obj);
						if (!oldRow.hasOwnProperty(dataIndx)) {
							oldRow[dataIndx] = rowData[dataIndx]
						}
					}
				}
				if ($.isEmptyObject(oldRow)) {
					newudata.splice(i, 1)
				}
				break
			}
		}
		if (!_found) {
			var oldRow = {};
			for (var dataIndx in newRow) {
				oldRow[dataIndx] = rowData[dataIndx];
				var obj = {
					rowData: rowData,
					dataIndx: dataIndx,
					refresh: refresh,
					cls: dirtyClass
				};
				that.addClass(obj)
			}
			/***********该数据是添加数据时 不记录在修改数据数组中 所以加判断条件 (cl) fnGrid.addRow中有用到 **************/
			if (rowData['_status'] != 'add') {
				var obj = {
					rowData: rowData,
					recId: recId,
					oldRow: oldRow
				};
				newudata.push(obj)
			}
			/********************************** */
		}
		this.udata = newudata
	};

	var _PC = $.paramquery.cCells.prototype;
	var _PR = $.paramquery.cRows.prototype;
	var fn = $.paramquery._pqGrid.prototype;
	fn._init = function () {
		var _pKeyNav = this.iKeyNav.__proto__ || Object.getPrototypeOf(this.iKeyNav);
		_pKeyNav._keyDownInEdit = function (evt) {
			var that = this.that,
				o = that.options;
			var EMIndx = o.editModel.indices;
			if (!EMIndx) {
				return
			}
			var $this = $(evt.target),
				keyCodes = $.ui.keyCode,
				SM = o.selectionModel,
				gEM = o.editModel,
				offset = that.rowIndxOffset,
				obj = $.extend({}, EMIndx),
				rowIndxPage = obj.rowIndxPage,
				colIndx = obj.colIndx,
				column = obj.column,
				cEM = column.editModel,
				EM = cEM ? $.extend({}, gEM, cEM) : gEM;
            var byVal = this.getValText($this);
            var dataLastIndx = o.dataModel.data.length-1;  // 获取数据中最后一个索引值
			$this.data("oldVal", $this[byVal]());
			if (that._trigger("cellEditKeyDown", evt, obj) == false) {
				return false
			}
			if (that._trigger("editorKeyDown", evt, obj) == false) {
				return false
			}
			if (evt.keyCode == keyCodes.TAB) {
				var obj;
				if (evt.shiftKey) {
					obj = this._decrEditIndx(rowIndxPage, colIndx);
				} else {
					// --------  add (cl)--------------------------
					if (o.addRowByKey) {
						var rowIndx2 = EMIndx.rowIndx; // 获取该行的索引值
						var column2 = EMIndx.column.dataIndx; //  获取该单元格的列名
						var length = o.colModel.length;
						while (length--) {
							if (o.colModel[length].editable !== false) {
								break;
							}
						}
						var lastColumnEditable = o.colModel[length].dataIndx; // 获取列名中最后的可编辑列
						if (rowIndx2 == dataLastIndx && column2 == lastColumnEditable) { // 使光标停留在最后一行的最后的可编辑列中
							that.addRow({
								rowData: {}
							});
						}
						//---------------
					}
					obj = this._incrEditIndx(rowIndxPage, colIndx);
				}
				if (obj == null) {
					obj = {
						rowIndxPage: rowIndxPage,
						colIndx: colIndx
					}
				}
				return this._saveAndMove(obj, evt)
			} else {

				if (evt.keyCode == EM.saveKey) {
					var obj, obj2;
					obj = {
						rowIndxPage: rowIndxPage,
						colIndx: colIndx,
						edit: false
					};
					obj2 = $.extend({}, obj);
					this._saveAndMove(obj, evt);
					/**************回车时 跳入下一个单元格的代码   add(cl)******** */
					if (evt.shiftKey) {
						obj = this._decrEditIndx(rowIndxPage, colIndx);
					} else {
						obj = this._incrEditIndx(rowIndxPage, colIndx);
					}
					var c_obj = {
						prevR: obj2,
						nowR: obj
					}

					if (obj && rowIndxPage != obj.rowIndxPage) {
						if (that._trigger("changeRow", evt, c_obj) == false) { // add event (cl)
							return false
						}
					} else if (!obj) {
						if (that._trigger("changeRow", evt, c_obj) == false) {
							return false
						}
					}

					if (obj) {
						var rowIndx = obj.rowIndxPage + offset;
						this.select({
							rowIndx: rowIndx,
							colIndx: obj.colIndx,
							evt: evt
						})
					}
					evt.preventDefault();
					/***************************************************** */
					return false;
				} else {
					if (evt.keyCode == keyCodes.ESCAPE) {
						that.quitEditMode({
							evt: evt
						});
						if (SM.type == "cell") {
							var $td = that.getCell({
								rowIndxPage: rowIndxPage,
								colIndx: colIndx
							});
							$td.attr("tabindex", 0).focus()
						} else {
							if (SM.type == "row") {
								var $tr = that.getRow({
									rowIndxPage: rowIndxPage
								});
								$($tr[0]).attr("tabindex", 0).focus()
							}
						}
						evt.preventDefault();
						return false
					} else {
						if (evt.keyCode == keyCodes.PAGE_UP || evt.keyCode == keyCodes.PAGE_DOWN) {
							evt.preventDefault();
							return false
						} else {
							if (EM.keyUpDown) {
								if (evt.keyCode == keyCodes.DOWN) {
									var obj = this._incrEditRowIndx(rowIndxPage, colIndx);
									return this._saveAndMove(obj, evt)
								} else {
									if (evt.keyCode == keyCodes.UP) {
										var obj = this._decrEditRowIndx(rowIndxPage, colIndx);
										return this._saveAndMove(obj, evt)
									}
								}
							}
						}
					}
				}
			}
			return;

		};
		_pKeyNav.select = function (objP) {
			var that = this.that,
				rowIndx = objP.rowIndx,
				colIndx = objP.colIndx,
				SM = that.options.selectionModel,
				evt = objP.evt;
			if (evt.shiftKey && SM.mode != "single") {
				if (SM.type == "row") {
					that.scrollRow({
						rowIndx: rowIndx
					});
					that.iRows.extendSelection({
						rowIndx: rowIndx,
						evt: evt
					})
				} else {
					if (SM.type == "cell") {
						that.scrollCell({
							rowIndx: rowIndx,
							colIndx: colIndx
						});
						/* that.iCells.extendSelection({ 
							rowIndx: rowIndx,
							colIndx: colIndx,
							evt: evt
						}) */
						/**************** 以上是源码 以下是修改过的代码 取消单元格连选(cl)********* */
						that.setSelection({
							rowIndx: rowIndx,
							colIndx: colIndx,
							evt: evt,
							setFirst: true
						})
						/************************************************** */
					}
				}
			} else {
				that.setSelection({
					rowIndx: rowIndx,
					colIndx: colIndx,
					evt: evt,
					setFirst: true
				})
			}
		};
	}
	/* setTimeout(function (){
	},300) */
	_PR.extendSelection = function () {
		/*****(cl) extendSelection 方法先禁用****/
		return false;
	};
	_PR.selectAll = function (objP) { //  所有行全选方法
		var that = this.that,
			all = (objP && objP.all) ? true : false,
			data = all ? this.options.dataModel.data : that.data,
			rows = [];
		if (!data) {
			return
		}
		if (all) {
			var paging = this.options.pageModel.type,
				remote = (paging == "remote") ? true : false;
			for (var i = 0, len = data.length; i < len; i++) {

				if (data[i].disabledcheckbox) { //  disabledcheckbox有值时不会被选择  add (cl)
					continue;
				}
				var obj = {
					rowData: data[i],
					focus: false
				};
				if (remote) {
					obj.rowIndxPage = i
				} else {
					obj.rowIndx = i
				}
				rows.push(obj)
			}
		} else {
			for (var i = 0, len = data.length; i < len; i++) {
				if (data[i].disabledcheckbox) { //  disabledcheckbox有值时不会被选择  add (cl)
					continue;
				}
				var rowData = data[i];
				rows.push({
					rowIndxPage: i,
					rowData: rowData,
					focus: false
				})
			}
		}
		this.add({
			rows: rows
		})
	};
	_PC.extendSelection = function () {
		/******(cl) extendSelection 方法先禁用****/
		return false;
	}


	var _pMouseSelection = $.paramquery.cMouseSelection.prototype;
	_pMouseSelection._onCellMouseDown = function (evt, ui) {
		var that = this.that,
			rowIndx = ui.rowIndx,
			colIndx = ui.colIndx,
			SM = that.options.selectionModel,
			type = SM.type,
			mode = SM.mode;
		if (type != "cell") {
			return
		}
		if (colIndx == null) {
			return
		}
		/* if (evt.shiftKey) {   
			that.iCells.extendSelection({
				rowIndx: rowIndx,
				colIndx: colIndx,
				mode: mode,
				evt: evt
			}); */
		/************* 以上是原版 以下是加了判断条件 使它在'single'模式下取消按shift键 多选(cl)********* */
		if (evt.shiftKey && mode != 'single') { //  点击复选框时 按住shift键 进行多选
			that.iCells.extendSelection({
				rowIndx: rowIndx,
				colIndx: colIndx,
				mode: mode,
				evt: evt
			});
			/******************************************** */
			evt.preventDefault()
		} else {
			if (evt.ctrlKey && mode != "single") {
				if (that.iCells.isSelected({
						rowIndx: rowIndx,
						colIndx: colIndx
					})) {
					that.iCells.remove({
						rowIndx: rowIndx,
						colIndx: colIndx
					})
				} else {
					that.setSelection({
						rowIndx: rowIndx,
						colIndx: colIndx
					})
				}
			} else {
				this.mousedown = {
					rowIndx: rowIndx,
					colIndx: colIndx
				};

				//that.setSelection(null);   

				/***************以上是原版本  清除单元格(cell)以及行(row)为单位的选择状态  以下是只清除单元格为单位的选择状态 实现复选框选择时能多选(cl)********* */
				if (mode != "single") {
					that.iCells.removeAll({
						raiseEvent: true
					});
				} else {
					that.setSelection(null); //清空所选的行数据
				}
				/*********************************** */
				that.setSelection({
					rowIndx: rowIndx,
					colIndx: colIndx,
					setFirst: true
				})
			}
		}
		return true
	};
	_pMouseSelection._onRowMouseDown = function (evt, ui) {
		var that = this.that,
			self = this,
			rowIndx = ui.rowIndx,
			SM = that.options.selectionModel,
			mode = SM.mode,
			type = SM.type;
		/*if (type != "row") {
		return
		}*/
		// 以上是源版本代码 以下是另加了条件 当selectionModel.type值为'cell'时，使点击数字列依然能行选中  ---(cl)
		if (type != "row" && !$(evt.toElement).hasClass('pq-grid-number-cell')) {
			return
		}
		/******************************** */
		if (rowIndx == null) {
			return
		}
		if (evt.shiftKey) {
			that.iRows.extendSelection({
				rowIndx: rowIndx,
				evt: evt
			});
			evt.preventDefault()
		} else {
			if (evt.ctrlKey && mode != "single") {
				if (that.iRows.isSelected({
						rowIndx: rowIndx
					})) {
					that.iRows.remove({
						rowIndx: rowIndx
					})
				} else {
					that.setSelection({
						rowIndx: rowkIndx
					})
				}
			} else {
				this.mousedown = {
					r1: rowIndx,
					y1: evt.pageY,
					x1: evt.pageX
				};
				//点击已勾选的复选框时 取消选择
				if (that.iRows.isSelected({
						rowIndx: rowIndx
					})) {
					that.iRows.remove({
						rowIndx: rowIndx
					})
				} else {
					// 单选时先清空所有选择数据
					if (mode == "single") {
						that.setSelection(null);
					}
					that.setSelection({
						rowIndx: rowIndx
					})
				}
			}
		}
		return true
	};

	var fnTB = $.paramquery.pqToolbar.prototype;
	fnTB._init = function () {
		var self = this,
			options = this.options,
			that = options.gridInstance,
			CM = that.colModel,
			element = this.element,
			items = options.items;
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i],
				type = item.type,
				icon = 'ui-icon-' + item.icon, //  此处调用的是jqui.css的icon的class名  以下是原版本 ---(cl)
				$ctrl,
				itemid = item.id,
				disabled = item.disabled; //  新加的属性  ---(cl)
			if (type == "button") {
				if (disabled) {
					$("> .ui-corner-all", element).eq(i).button('disable')
				}
				$("> .ui-corner-all", element).eq(i).button('option', {
					icons: {
						primary: icon
					}
				})

				if (itemid) {
					$("> .ui-corner-all", element).eq(i).attr('toolbarid', itemid)
				}
			}
		}
	}
	/* fnTB._create = function () {
		var self = this,
			options = this.options,
			that = options.gridInstance,
			CM = that.colModel,
			items = options.items,
			element = this.element,
			$grid = element.closest(".pq-grid");
		element.addClass("pq-toolbar");
		for (var i = 0, len = items.length; i < len; i++) {
			var item = items[i],
				type = item.type,
				icon = item.icon,
				options = item.options,
				text = item.label,
				listener = item.listener,
				listeners = listener ? [listener] : item.listeners,
				itemcls = item.cls,
				cls = "ui-corner-all " + (itemcls ? itemcls : ""),
				itemstyle = item.style,
				style = itemstyle ? 'style="' + itemstyle + '"' : "",
				itemattr = item.attr,
				attr = itemattr ? itemattr : "",
				itemid = item.id,
				$ctrl;
				switch (type) {
					case "textbox": $ctrl = $("<input type='text' class='" + cls + "' " + attr + " " + style + ">").appendTo(element);break;
					case "checkbox": $ctrl = $("<input type='checkbox' class='" + cls + "' " + attr + " " + style + ">").appendTo(element);break;
					case "separator": $("<span class='pq-separator '" + cls + "' " + attr + " " + style + "></span>").appendTo(element);break;
					case "button": 
						var options = item.options ? item.options : {};
						$.extend(options, {
							text: text ? true : false,
							icons: {
								primary: icon
							}
						});
						$ctrl = $("<button type='button' class='" + cls + "' " + attr + style + ">" + text + "</button>").button(options).appendTo(element);break;
					case "select": 
						var options = item.options ? item.options : [];
						if (typeof options === "function") {
							options = options.call(that.element[0], {
								colModel: CM
							})
						}
						inp = $.paramquery.select({
							options: options,
							attr: " class='" + cls + "' " + attr + " " + style,
							prepend: item.prepend,
							groupIndx: item.groupIndx,
							valueIndx: item.valueIndx,
							labelIndx: item.labelIndx
						});
						$ctrl = $(inp).appendTo(element);
						break;
					case "menu": 
						$ctrl = $("<button id='TB-" + item.id + "' class='ui-corner-all ui-button ui-widget ui-state-default ui-button-text-icon-primary menu-bar' ><span>" + item.label + "</span><span class='triangle-top'></span></button>").appendTo(element);
						item.id = 'TB-' + item.id;
						var $menu = $("<div id='menu-bar' style='display:none;position:absolute'></div>").appendTo(element);
						$menu.menu(item);
						$ctrl.click(function () {
							var offsetT = element.outerHeight() - 5;
							var offsetL = $(this).position().left;
							$menu.css({
								top: offsetT,
								left: offsetL,
								'z-index': 9999
							}).show();
						});
						$ctrl.hover(function () {
							$(this).addClass('ui-state-hover');
						}, function () {
							$(this).removeClass('ui-state-hover');
						});break;
					default:
						if (typeof type == "string") {
							$ctrl = $(type).appendTo(element)
						} else {
							if (typeof type == "function") {
								var inp = type.call(that.element[0], {
									colModel: CM,
									cls: cls
								});
								$ctrl = $(inp).appendTo(element)
							}
						}
				
				}
			if (listeners) {
				for (var j = 0; j < listeners.length; j++) {
					var listener = listeners[j];
					for (var event in listener) {
						$ctrl.bind(event, listener[event])
					}
				}
			}
		}
	} */
	/**=======================新添方法====================================== */
	var fnTB = $.paramquery.pqToolbar.prototype;
	fnTB.setDisabled = function (itemid) {
		var $toolbar = this.element;
		$("> .ui-button-text-icon-primary[toolbarid=" + itemid + "]", $toolbar).button('disable');
	};
	fnTB.setEnabled = function (itemid) {
		var $toolbar = this.element;
		$("> .ui-button-text-icon-primary[toolbarid=" + itemid + "]", $toolbar).button('enable');
	}
})(jQuery);