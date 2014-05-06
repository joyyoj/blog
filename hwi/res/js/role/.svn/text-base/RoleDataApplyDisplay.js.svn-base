(function() {
    beforeCheck = function(treeId, treeNode) {
        return false;
    }

    $(document).ready(function() {
        $.fn.zTree.getZTreeObj('applyDataTree').setting.async = {
            enable: true,
            url: '?m=Role&a=DataApply&f=ajaxGetChildrenById',
            autoParam: ['id=nodeId', 'checked']
        };

        var authority = authority;
        if (authority.charAt(authority.length - 1) == '1') {
            $('input[name="authority"]').get(2).checked = true;
        }
        if (authority.charAt(authority.length - 2) == '1') {
            $('input[name="authority"]').get(1).checked = true;
        }
        if (authority.charAt(authority.length - 3) == '1') {
            $('input[name="authority"]').get(0).checked = true;
        }
    });
})();