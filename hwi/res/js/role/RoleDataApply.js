(function() {
    var treeObj;
    var approverList = [];
    var productLine = ''; //当前产品线                                              
    updateDataApply = function(infos) {
        var confidentialUrl = '';
        var secretUrl = '';
        approverList = [];
        var approver = '';
        var minApproverLever = 100000;
        var delNodeList = [];

        if (infos.length == 0) {
            productLine = '';
        }

        //包含init=true属性的节点祖先节点全部不能在url里显示                       
        for (var i = 0, size = infos.length; i < size; i++) {
            node = infos[i];
            if (node.init == true) {
                var pnode = node;
                while (pnode = pnode.getParentNode()) {
                    delNodeList.push(pnode.id);
                }
            }
        }
        delNodeList = delNodeList.delUnique();

        for (var i = 0, size = infos.length; i < size; i++) {
            info = infos[i];
            if (info.level == 1) {
                productLine = info.name;
            }

            //判断审批人：选择level最低的节点（叶子节点比文件夹的等级低，并取它的父节点的审批人）的审批人          
            if (info.level > 1 && info.workflowFlag == 1) {
                if (info.level < minApproverLever && info.check_Child_State != 1 && info.manager != '' && typeof(info.manager) != 'undefined') {
                    minApproverLever = info.level;
                    approver = info.manager;
                }
                if (info.level <= minApproverLever && info.isParent == false) {
                    minApproverLever = info.level;
                    approver = info.getParentNode().manager;
                }
                if (info.manager != '' && typeof(info.manager) != 'undefined') {
                    approverList.push(info.manager);
                }
            }

            //生成URL字符串：在全选的节点中，筛除父节点也是全选的节点              
            if (info.level > 1 && info.check_Child_State != 1) { //全选              
                if (info.level > 1 && info.getParentNode().check_Child_State == 2 && (!info.init || info.init == false) || delNodeList.in_array(info.id)) { //此节点的父节点是全选中状态
                    continue;
                }

                if (info.workflowFlag == 1) {
                    confidentialUrl += info.id + ',';
                } else {
                    secretUrl += info.id + ',';
                }
            }
        }
        approverList.delUnique();
        if (confidentialUrl != '') {
            confidentialUrl = PreUri + '&confidentialUrl=' + confidentialUrl.substr(0, confidentialUrl.length - 1) + '&';
        }
        $('#confidentialUrl').val(confidentialUrl);
        $('#confidentialUrlTmp').val(confidentialUrl);
        appendUrl();
        $('#secretUrl').val(secretUrl);
        $('#approver').val(approver);
        checkUrl();
    }

    beforeCheck = function(treeId, treeNode) {
        if (treeNode.checked == true || approverList.length == 0 && treeNode.manager != '') {
            return;
        }
        var pnode = treeNode;
        var nodePath = treeNode.name;
        while (pnode = pnode.getParentNode()) {
            nodePath = pnode.name + '.' + nodePath;
        }
        //if(nodePath.indexOf('保密') > 0){                                     
        if (treeNode.workflowFlag == 2) {
            return;
        }
        var paths = nodePath.split('.');
        if (paths.length <= 2) {
            showErrMessage('前两级节点不能勾选！');
            return false;
        }
        if (productLine != '' && paths[1] != productLine) {
            showErrMessage('您选择的机密数据不属于同一产品线！');
            return false;
        }
        var myApproverList = [];
        if (treeNode.manager != '') {
            myApproverList.push(treeNode.manager);
        } else {
            showErrMessage('您选择的机密数据不能提交给同一审批人！');
            return false;
        }
        var tmpNode = treeNode;
        while (tmpNode = tmpNode.getParentNode()) {
            if (tmpNode.manager != '') {
                myApproverList.push(tmpNode.manager);
            }
        }
        for (var i in myApproverList) {
            if (approverList.in_array(myApproverList[i])) {
                return true;
            }
        }
        showErrMessage('您选择的机密数据不能提交给同一审批人！');
        return false;
    }

    function appendUrl() {
        var privilege = 0;
        $('input[name="confidentialAuthority"]:checked').each(function() {
            privilege += parseInt($(this).val());
        });
        if (privilege != 0) {
            $('#confidentialUrl').val($('#confidentialUrlTmp').val() + 'authority=' + privilege.toString(2));
        } else {
            $('#confidentialUrl').val($('#confidentialUrlTmp').val());
        }
    }

    function checkUrl() {
        var url = $('#confidentialUrl').val();
        var reg = new RegExp('^http.+[^&]$');
        if (reg.test(url)) {
            $('#confidentialUrl').attr('readonly', false);
            return true;
        } else {
            $('#confidentialUrl').blur().attr('readonly', true);
            return false;
        }
    }

    Array.prototype.delUnique = function() {
        this.sort();
        var re = [this[0]];
        for (var i = 1; i < this.length; i++) {
            if (this[i] !== re[re.length - 1]) {
                re.push(this[i]);
            }
        }
        return re;
    };

    Array.prototype.in_array = function(e) {
        for (i = 0; i < this.length; i++) {
            if (this[i] == e) return true;
        }
        return false;
    }

    $(document).ready(function() {
        $('.tip-desc').poshytip({
            className: 'tip-yellowsimple',
            showTimeout: 1,
            alignTo: 'target',
            alignX: 'center',
            offsetY: 5,
            allowTipHover: true
        });

        if (window.location.href.indexOf('&departs=') > 0) {
            $('#secretForm').hide().prev().hide();
            $('.breadcrumb').hide();
        }

        new bsn.AutoSuggest('applicant', auto_suggest_options_comma2);
        new bsn.AutoSuggest('mailgroup', auto_suggest_options_mail_comma2);
        realtimeVerifyForm($('form#secretForm'));

        treeObj = $.fn.zTree.getZTreeObj('applyDataTree');
        treeObj.setting.async = {
            enable: true,
            url: '?m=Role&a=DataApply&f=ajaxGetChildrenById',
            autoParam: ['id=nodeId', 'checked']
        };

        $('input[name="confidentialAuthority"]').change(function() {
            appendUrl();
            checkUrl();
        });

        $('#submitFormBtn').click(function() {
            sumbmitForm('?m=WorkflowProcess&a=Begin&f=applySensitiveData');
        });

        $('#confidentialUrl').focus(function() {
            checkUrl();
        });

        $('#backToPreBtn').click(function() {
            window.history.go( - 1);
        });

        function sumbmitForm(url) {
            if (!preSubmitVerifyForm($('form#secretForm'))) {
                return;
            }
            if ($('#secretUrl').val() == '') {
                showErrMessage('请选择保密数据！');
                return;
            }
            if ($('#applicant').val() == '' && $('#mailgroup').val() == '') {
                showErrMessage('请输入保密数据申请人或申请邮件组！');
                return;
            }
            var privilege = 0;
            $('input[name="secretAuthority"]:checked').each(function() {
                privilege += parseInt($(this).val());
            });
            if (privilege == 0) {
                showErrMessage('请选择保密数据权限！');
                return;
            }
            if ($('#applyReason').val().length > 2000) {
                showErrMessage('您输入的申请理由超过2000个字符，请删减内容！');
                return;
            }
            data = {};
            data.secretUrl = $('#secretUrl').val();
            data.applicant = $('#applicant').val();
            data.mailgroup = $('#mailgroup').val();
            data.privilege = privilege.toString(2);
            data.applyReason = $('#applyReason').val();
            $('#submitFormBtn').addClass('disabled');
            $.post(url, data, function(ret) {
                if (ret.status == 'success') {
                    showMessage('操作成功!');
                } else {
                    showErrMessage(ret.message);
                }
                $('#submitFormBtn').removeClass('disabled');
            }, 'json').error(function() {
                showErrMessage('系统出现异常，请联系管理员');
                $('#submitFormBtn').removeClass('disabled');
            });
        }
    });
})();