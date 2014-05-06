/**
 * @author zhushengyun@baidu.com
 * @desc QEWI日志树
 */
var TreeNodeClient = Class.create();
Object.extend(TreeNodeClient.prototype, {
    name: 'TreeNodeClient',

    // 初始化
    initialize: function(treeNodes) {
        this.initializeData(treeNodes);
        this.initializeDOM();
        this.initializeEvent();
    },

    // 初始化数据
    initializeData: function(treeNodes) {
        // 树节点数据
        this.treeNodes = treeNodes; 

        /**
         * 页面自定义事件容器, 外部通过本页bindEvent方法将事件方法注册到这里
         * @type {Object.<string, Array.<Function>>}
         * @private
         */
        this.eventMap_ = {};
    },

    // 初始化DOM元素
    initializeDOM: function() {
        this.searchInputDom = $('#qewi-zTreeSearch');
        this.treeDom = $('#qewi-zTree');

        // 初始化树
        var zTreeSettings = {}
        zTreeSettings.view = {expandSpeed: 'fast'}
        zTreeSettings.callback = {onClick: this.zTreeNodeClick.bind(this)}
        this.treeObj = $.fn.zTree.init(this.treeDom, zTreeSettings, this.treeNodes);
    },

    // 初始化DOM事件
    initializeEvent: function() {
        this.searchInputDom.keyup(this.searchInputDomKeyup.bind(this));
    },

    // 销毁DOM
    destroyDOM: function() {
        this.domIdTreeSearch = null;
    },

    // 销毁事件
    destroyEvent: function() {
        this.logTreeSearchKeyUp.unbind('keyup');
    },

    // 析构
    dispose: function() {
        this.destroyEvent();
        this.destroyDOM();
    },

    /**
     * 绑定事件
     * @param {string} eventName 本页面的自定义事件名称
     * @param {Function} eventFunction 事件方法
     * @return {boolean} true绑定成功，false绑定失败
     */
    bindEvent: function(eventName, eventFunction) {
        if (eventName && $.isFunction(eventFunction)) {
            if ($.isArray(this.eventMap_[eventName])) {
                this.eventMap_[eventName].push(eventFunction);
            } else {
                this.eventMap_[eventName] = [eventFunction];
            }
            return true;
        } else {
            return false;
        }
    },


    /**
     * 取消绑定事件
     * @param {string} eventName 取消绑定的事件名
     * @return {boolean} true绑定成功，false绑定失败
     */
    unbindEvent: function(eventName) {
        if (eventName &&  $.isArray(this.eventMap_[eventName])) {
            this.eventMap_[eventName] = null;
            return true;
        } else {
            return false;
        }
    },

    /**
     * 触发事件方法
     * @param {string} eventName 事件名称
     * @param {...*} varArgs
     * @protected
     * @desc 如果注册多个方法，FIFO方式依次执行
     */
    fireEvent: function(eventName, varArgs) {
        if (!eventName) {
            return;
        }
        var funcArray = this.eventMap_[eventName];
        var funcReturn;
        if ($.isArray(funcArray) && funcArray.length > 0) {
            var args = Array.prototype.slice.call(arguments, 1);
            for (var i = 0, len = funcArray.length; i < len; i++) {
                funcReturn = funcArray[i].apply(this, args);
            }
        }
        return funcReturn;
    },

    // 搜索框按键弹起事件方法
    searchInputDomKeyup: function(event) {
        var keyword = this.searchInputDom.val();
        keyword = $.trim(keyword.toLowerCase());

        var tNodesArray = this.treeObj.transformToArray(this.treeObj.getNodes());
        
        // 恢复状态 
        $.each(tNodesArray, function(i,n){
            $('#' + n.tId + '_a').css('font-weight', '')
        });
        this.treeObj.hideNodes(tNodesArray);

        if(keyword == '') {
            this.treeObj.showNodes(tNodesArray);
            this.treeObj.expandAll(false);
            this.treeObj.expandNode(tNodesArray[0]);
            this.searchInputDom.focus();
            return;
        }

        // 过滤节点
        var nodes = this.treeObj.getNodesByParamFuzzy('filterKey', keyword);
        $.each(nodes, (function(i, n) {
            // 显示、展开、选中
            this.treeObj.showNode(n);
            this.treeObj.expandNode(n, true);
            $('#' + n.tId + '_a').css('font-weight', 'bold')

            // 显示节点的父节点
            var pNode = n;
            this.treeObj.showNodes(this.treeObj.transformToArray(pNode));
            while (pNode = pNode.getParentNode()) {
                this.treeObj.showNode(pNode);
                this.treeObj.expandNode(pNode, true);
            }
        }).bind(this));
        this.searchInputDom.focus();
        return true;
    },

    // 树节点的点击事件方法
    zTreeNodeClick: function(event, treeId, treeNode) {
        // 展开/折叠选中的父节点
        this.toggleNodes([treeNode]);
        if (treeNode.getParentNode() == null) {
            this.fireEvent('onRootNodeClick', treeNode);
        }

        // 叶子节点点击事件
        if (!$.isArray(treeNode.children) || treeNode.children.length == 0) {
            this.fireEvent('onLeafNodeClick', treeNode);
        }
    },

    // 展开/折叠传入的节点
    toggleNodes: function(nodes) {
        for (var i=0, l=nodes.length; i<l; i++) {
            this.treeObj.setting.view.fontCss = {};
            this.treeObj.expandNode(nodes[i], null, null, null, false);
        }
    }

});
