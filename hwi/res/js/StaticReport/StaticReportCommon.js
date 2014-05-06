/*
 *  "StaticReportCommon.js": StaticReport common lib
 *  @author dt-lsp(zhushengyun@baidu.com)
 *  @date 2013/08/05 16:00:00
 */

/*
 * ProtoType Function: swap;
 * description: value swap for Array;
 * @param: {number} The index for Array;
 * @param: {number} The index for Array;
 */
Array.prototype.swap = function(i, j) {
    var temp = this[i];
    this[i] = this[j];
    this[j] = temp;
};

/*
 * ProtoType Function: ascSort;
 * description: The Array values Sequence with positive; 
 * @param: {};
 * @return: {Array};
 */
Array.prototype.ascSort = function() {
    for (var i = this.length - 1; i > 0; --i) {
        for (var j = 0; j < i; ++j) {
            if (this[j] > this[j + 1]) {
                this.swap(j, j + 1);
            }
        }
    }
    return this;
};

/*
 * ProtoType Function: descSort;
 * description: The Array values Sequence with negative;
 * @param: {};
 * @return: {Array};
 */
Array.prototype.descSort = function() {
    for (var i = this.length - 1; i > 0; --i) {
        for (var j = 0; j < i; ++j) {
            if (this[j] < this[j + 1]) {
                this.swap(j, j + 1);
            }
        }
    }
    return this;
};

/*
 * ProtoType Function: revertSort;
 * description: The Array values Sequence with original state;  
 * @param: {};
 * @return: {Array};
 */
Array.prototype.revertSort = function() {
    return this;
};

/*
 * ProtoType Function: ascIndex;
 * description: The table sort sequence with positive;
 * @param: {Array} The Array in current column of table;
 * @return: {Array} The Array is target sort sequence of index;
 */
Array.prototype.ascIndex = function(arr) {
    if (this.length <= 1) {
        return false;
    }
    var ascIndexArr = [];
    var lastIndex = null;
    for (var i = this.length - 1; i > 0; --i) {
        for (var j = 0; j < i; ++j) {
            if (this[j] > this[j + 1]) {
                this.swap(j, j + 1);
            }
            if (j == i - 1) {
                lastIndex = j;
            }
        }
        for (var k = 0; k < arr.length; k++) {
            var numFlag = false;
            if (ascIndexArr != null) {
                for (var l = 0; l < ascIndexArr.length; l++) {
                    if (ascIndexArr[l] == k) {
                        numFlag = true;
                        break;
                    }
                }
            }
            if (!numFlag) {
                if (this[lastIndex + 1] == arr[k] && lastIndex > 0) {
                    ascIndexArr.push(k);
                } else if (this[lastIndex + 1] == arr[k] && lastIndex == 0) {
                    ascIndexArr.push(k);
                } else if (this[lastIndex] == arr[k] && lastIndex == 0) {
                    ascIndexArr.push(k);
                }
            }
        }
    }
    return ascIndexArr;
};

/*
 * ProtoType Function: descIndex;
 * description: The table sort sequence with negative;
 * @param: {Array} The Array in current column of table;
 * @return: {Array} The Array is target sort sequence of index;
 */
Array.prototype.descIndex = function(arr) {
    if (this.length <= 1) {
        return false;
    }
    var descIndexArr = [];
    var lastIndex = null;
    for (var i = this.length - 1; i > 0; --i) {
        for (var j = 0; j < i; ++j) {
            if (this[j] < this[j + 1]) {
                this.swap(j, j + 1);
            }
            if (j == i - 1) {
                lastIndex = j;
            }
        }
        for (var k = arr.length - 1; k >= 0; --k) {
            var numFlag = false;
            if (descIndexArr != null) {
                for (var l = 0; l < descIndexArr.length; l++) {
                    if (descIndexArr[l] == k) {
                        numFlag = true;
                        break;
                    }
                }
            }
            if (!numFlag) {
                if (this[lastIndex + 1] == arr[k] && lastIndex > 0) {
                    descIndexArr.push(k);
                } else if (this[lastIndex + 1] == arr[k] && lastIndex == 0) {
                    descIndexArr.push(k);
                } else if (this[lastIndex] == arr[k] && lastIndex == 0) {
                    descIndexArr.push(k);
                }
            }
        }
    }
    return descIndexArr;
};



/*
 * Object: TableSort;
 * description: about table sequence operational;
 * @param: {
 *   sortFlag: boolean,        // The table rows sort types (condition);
 *   reiginalIndex: Array,     // The table rows reiginal sequence at loading
 *                                creat {Array} of index; 
 *   currentIndex: Array,      // The Tabls rows current sequence at operation
 *                                creat {Array} of index;
 *   scrollFlag: boolean,      // The scroll event at actived change (condition);
 *   creatSortIcon: function,  // To creat icon {Function} in table head th;
 *   flashSortIcon: function,  // To flash icon {Function} at change time event;
 *   removeSortIcon: function, // To remove icon {Function} at change time event;
 *   changeIcon: function,     // To chang icon type {Function} at click "table 
 *                                head th" event;
 *   creatArray: function,     // To creat Array {Function} for table rows sort;
 *   sortArray: function,      // To sort Array index {Function} for talbe rows;
 *   compareIndex: function,   // To compare Array {Function} for table sequence;
 *   sortIndex: function,      // To sort Array index {Function} for table odd 
 *                                rows background color;
 *   oddRowColor: function,    // To creat table background color {Function};
 *   sortBuild: function,      // To sort table rows {Function};
 *                                                             
 * };
 */
var TableSort = {
    sortFlag: true,
    scrollFlag: true,
    reiginal: [],
    reiginalIndex: [],
    currentIndex: null,
    reiginalBody: null,
    prevIndexArr: null,

    
/* 
 * Function: creatSortIcon;
 * @param: {Object} The table head th cells;
 * @param: {number} The table head th cels length;
 * @return: {};
 */
    creatSortIcon: function(ths, thLen) {
        var patten = /^\-?[0-9]+\.[0-9]*[1-9]\%?$|^\-?[0-9]+\%?$/;
        var rows = $('#tableContent tbody tr');
        var rowLen = $('#tableContent tbody tr').length;
        for (var i = 0; i < thLen; i++) {
            var index = $(ths[i]).index();
            var valStr = null;
            for (var j = 0; j < rowLen; j++) {
                valStr = $.trim($(rows[j]).find('td').eq(index).text());
                if (valStr == '') {
                    continue;
                } else {
                    break;
                }
            }
            if (patten.test(valStr)) {
                $(ths[i]).addClass('sort-both').css({'cursor': 'pointer'});
            }
        }
    },

/* 
 * Function: flashSortIcon;
 * @param: {Array} The static report table array;
 * @param: {string} The static report table type[value|list];
 * @return: {};
 */
    flashSortIcon: function(data, tableType) {
        var patten = /^\-?[0-9]+\.[0-9]*[1-9]\%?$|^\-?[0-9]+\%?$/;                     
        var ths = $('#tableContent thead tr th');
        var num = 0;
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {                                 
                if ($(ths[j]).attr('class') == 'sort-both') {
                    continue;
                }
                if (tableType == 'value') {
                    if (patten.test(data[i][j].name)) {                                    
                        $(ths[j]).addClass('sort-both').css({'cursor': 'pointer'});
                    }
                } else if(tableType == 'list') {
                    if (patten.test(data[i][j])) {
                        $(ths[j]).addClass('sort-both').css({'cursor': 'pointer'});
                    }
                }

            }
        }    
    },

/* 
 * Function: removeSortIcon;
 * @param: {Object} The table head th cells;
 * @param: {number} The table head th cels length;
 * @return: {};
 */
    removeSortIcon: function(ths, thLen) {
        for (var i = 0; i < thLen; i++) {
            $(ths[i]).removeClass();
        }
    },

/* 
 * Function: changeIcon;
 * @param: {Object} The table thead current th cell;
 * @param: {string} The table rows sequence current sort type;
 * @param: {Object} The table head th cells;
 * @param: {number} The table head th cels length;
 * @param: {string} The state report event type[time turn click|th cell click];
 * @return: {};
 */
    changeIcon: function(obj, className, ths, thLen, eventType) {
        TableSort.removeSortIcon(ths, thLen);
        TableSort.creatSortIcon(ths, thLen);

        if (eventType == 'timeClick') {
            switch (className) {
            case 'sort-both':
                $(obj).removeClass();
                $(obj).addClass('sort-both');
                break;
            case 'sort-asc':
                $(obj).removeClass();
                $(obj).addClass('sort-asc');
                break;
            case 'sort-desc':
                $(obj).removeClass();
                $(obj).addClass('sort-desc');
                break;
            }
        } else {
            switch (className) {
            case 'sort-both':
                $(obj).removeClass();
                $(obj).addClass('sort-asc');
                break;
            case 'sort-asc':
                $(obj).removeClass();
                $(obj).addClass('sort-desc');
                break;
            case 'sort-desc':
                $(obj).removeClass();
                $(obj).addClass('sort-asc');
                break;
            
            }
        }
    },

/* 
 * Function: creatArray;
 * @param: {number} The table column index number;
 * @return: {Array};
 */
    creatArray: function(index) {
        var rows = $('#tableContent tbody tr');
        var rowLen = $('#tableContent tbody tr').length;
        var valArr = [];
        for (var i = 0; i < rowLen; i++) {
            var valStr = $(rows[i]).find('td').eq(index).text();
            
            if (valStr == undefined) {
                return;
            }
            
            if (valStr == '') {
                valStr = ' ';
            }

            var numFlag = valStr.indexOf('.');
            
            if (numFlag != -1) {
                if (valStr.indexOf('%') != '-1') {
                    valStr = valStr.substr(0, valStr.indexOf('%'));
                }
                valArr.push(parseFloat(valStr, 10));
            } else  {
                if (valStr == ' ') {
                    valArr.push(' ');
                } else {
                    valArr.push(parseInt(valStr, 10));
                }
            }
        }
        return valArr;
    },

/* 
 * Function: sortArray;
 * @param: {Array} The table one column all rows value;
 * @return: {Array};
 */
    sortArray: function(valArr) {
        var indexArr = [],
            maxval,
            flag = false;
        for (var i = 0; i < valArr.length; i++) {
            for (var ii = i + 1; ii < valArr.length - 1; ii++) {
                if (valArr[i] > valArr[ii]) {
                    continue;
                } else {
                    valArr[i] = valArr[ii];
                }
            }

            indexArr.push(valArr[i]);
            continue;
        }
        return indexArr;
    },

/*
 * Function: reiginalIndex;
 * description: Return the table of reiginal sequence;
 * @param: {Array} The Array is reiginal at current column of table;
 * @return: {Array} The Array is reiginal sequence at current column of table;
 */
    reginalIndex: function(indexArr) {
        var reginalIndexArr = [];
        for (var i = 0; i < indexArr.length; i++) {
            for (var j = 0; j < indexArr.length; j++) {
                if (i == indexArr[j]) {
                    reginalIndexArr.push(j);
                }
            } 
        }
        return reginalIndexArr;
    },

/* 
 * Function: sortIndex;
 * @param: {Array};
 * @return: {};
 */
    sortIndex: function(indexArr, index, eventType) {
        if (indexArr == false) {
            return;
        }
        var rowsArr = '';
        var tbody = $('#tableContent tbody');
        var rows = $('#tableContent tbody tr');
        for (var i = 0; i < indexArr.length; i++) {
            if (i == indexArr.length - 2 && (eventType == 'sort-desc' || eventType == 'sort-both')) {
                var val1 = $(rows).eq(indexArr[i]).find('td').eq(index).text();
                var val2 = $(rows).eq(indexArr[i + 1]).find('td').eq(index).text();
                if (val1 == '') {
                    val1 = ' ';
                }
                if (val2 == '') {
                    val2 = ' ';
                }
                
                if (val1 < val2) {
                    var tempRow1 = $(rows).eq(indexArr[i]).get(0).outerHTML;
                    var tempRow2 = $(rows).eq(indexArr[i + 1]).get(0).outerHTML;
                    rowsArr += tempRow2;
                    rowsArr += tempRow1;
                    break;
                }
            }
            rowsArr += $(rows).eq(indexArr[i]).get(0).outerHTML;
        }
        $(tbody).empty().append(rowsArr);
    },


/* 
 * Function: oddRowsColor;
 * @param: {};
 * @return: {};
 */
    oddRowColor: function() {
        $('#tableContent tbody tr').each(
        function() {
            $(this).removeClass('odd');
        });
        $('#tableContent tbody tr:odd').each(
        function() {
            $(this).addClass('odd');
        });
    },

/* 
 * Function: sortBuild;
 * @param: {Object} The table thead current th cell;
 * @param: {Object} The table head th cells;
 * @param: {number} The table head th cels length;
 * @param: {number} The table column index number;
 * @param: {string} The state report event type[time turn click|th cell click];
 * @return: {};
 */
    sortBuild: function(obj, ths, thLen, index, eventType) {
        var arr = TableSort.creatArray(index);
        if (arr == undefined) {
            return;
        }

        if (TableSort.currentIndex != index) {
            TableSort.currentIndex = index;
            TableSort.sortFlag = true;
        }

        if (TableSort.sortFlag) {
            TableSort.reiginal = TableSort.creatArray(index);
            TableSort.sortFlag = false;
        }
        
        var className = $(obj).attr('class');
        TableSort.changeIcon(obj, className, ths, thLen, eventType);

        var tempArr = TableSort.creatArray(index);
        var indexArr;
        if (eventType == 'timeClick') {
            switch (className) {
            case 'sort-both':
                indexArr = arr.ascIndex(tempArr);
                TableSort.sortIndex(indexArr);
                break;
            case 'sort-asc':
                indexArr = arr.descIndex(tempArr);
                TableSort.sortIndex(indexArr);
                break;
            case 'sort-desc':
                indexArr = arr.ascIndex(tempArr);
                TableSort.sortIndex(indexArr, index, className);
                break;
            }
        } else {
            switch (className) {
            case 'sort-both':
                indexArr = arr.ascIndex(tempArr);
                TableSort.sortIndex(indexArr, index, className);
                break;
            case 'sort-asc':
                indexArr = arr.descIndex(tempArr);
                TableSort.sortIndex(indexArr, index, className);
                break;
            case 'sort-desc':
                indexArr = arr.ascIndex(tempArr);
                TableSort.sortIndex(indexArr, index, className);
                break;
            }
        }
        TableSort.oddRowColor();       
    }
};

/*
 * Object: ReportChart;
 * @type: {Object} The report chart object;
 */

var ReportChart = {
    position: {
        top: null,
        left: null
    },
    postionThead: {
        top: null,
        left: null
    }
};

/*
 * 页面初始化区域
 */
(function() {
    // 遍历渲染隔行底色
    $('#tableContent tbody tr:odd').each(function() {
        $(this).addClass('odd');
    });
    ReportChart.position = $('.reportCharts').position();
    ReportChart.positionThead = $('#tableContent thead').position();
    TableSort.reiginalBody = $('#tableContent tbody').html();
})();

/*
 * 页面事件区域
 */
$(document).ready(function() {
    var docDom = this;
    var ths = $('#tableContent thead tr th');
    var thLen = $('#tableContent thead tr th').length;
    
    // add排序icon
    TableSort.creatSortIcon(ths, thLen);
    
    // 排序事件
    $(ths).live('click', function() {
        var index = $(this).index();
        TableSort.sortBuild(this, ths, thLen, index, 'theadClick');
    });

});
