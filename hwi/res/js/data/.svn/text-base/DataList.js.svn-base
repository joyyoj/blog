dataType = dataType.toLowerCase();
dataColDef = [{
    'sWidth': '35%',
    'aTargets': [2]
},
{
    'sWidth': '1px',
    'aTargets': [4]
},
{
    'sWidth': '1px',
    'aTargets': [5]
},
{
    'sWidth': '1px',
    'aTargets': [6]
},
{
    'sWidth': '40px',
    'aTargets': [7]
},
{
    'sWidth': '1px',
    'aTargets': [8]
}];

(function() {
    var params = [{
        'name': 'dataType',
        'value': dataType
    }];
    var firsttime = false; //第一次datatable会自己调用一次，导致加载两次，所以屏蔽第一次
    changeParams = function(aoData) {
        showLoadingMessage('正在加载数据...');
        $.each(params, function(i, n) {
            aoData.push(n);
        });
    }

    switchButtonState = function(size) {
        var list = ['#datarecord', ];
        setButtonState(list, size);
    }

    myTableDraw = function(setting) {
        $('#datavizdt tr').live('dblclick', function(e) {
            $(e.target).parent().addClass('row_selected');
        });

        listtable.$('tr').find('td:eq(1),th:eq(1)').addClass('hd');
        listtable.$('tr').find('td:eq(2),th:eq(2)').addClass('hd');
        listtable.$('tr').find('td:eq(5),th:eq(5)').addClass('hd');
        listtable.$('tr').find('td:eq(10),th:eq(10)').addClass('hd');
        listtable.$('tr').find('td:eq(11),th:eq(11)').addClass('hd');
        listtable.$('tr').find('td:eq(12),th:eq(12)').addClass('hd');
        listtable.$('tr').find('td:eq(9)').addClass('hd');
        hideLoadingMessage();
    }

    updateTable = function(str) {
        params = str;
        if (!firsttime) {
            setTimeout(function() {
                listtable.fnSort([1, 'asc']);
            }, 100);
        } else {
            firsttime = false;
        }
    }

    function applyData() {
        var data = $('#applyDataForm').serializeArray();
        $.post('?m=WorkflowProcess&a=Begin&f=applyData', {data: data}, function(ret) {
            if (ret.status == 'success') {
                showMessage('数据申请提交成功！');
            } else {
                showErrMessage('申请失败：' + ret.message);
            }
        }, 'json').error(function() {
            showErrMessage('申请失败，或者联系管理员');
        });
        $('#addPermissionDialog').modal('hide');
    }

    $(document).ready(function() {
        // Log列表页隐藏wikiLink
        var wikiLinkFlag = location.search.indexOf('source=Log');
        if (wikiLinkFlag != -1) {
            $('#wiki_link_for_event').hide();
        }

        $('.tip-desc').poshytip({
            className: 'tip-yellowsimple',
            showTimeout: 1,
            alignTo: 'target',
            alignX: 'center',
            offsetY: 5,
            allowTipHover: true
        });

        realtimeVerifyForm($('#applyDataForm'));
        $('#datavizdt tr').find('th:eq(0)').addClass('hd');
        $('#datavizdt tr').find('th:eq(1)').addClass('hd');
        $('#datavizdt tr').find('th:eq(4)').addClass('hd');
        $('#datavizdt tr').find('th:eq(9)').addClass('hd');
        $('#datavizdt tr').find('th:eq(8)').addClass('hd');
        $('#datavizdt tr').find('th:eq(10)').addClass('hd');
        $('#datavizdt tr').find('th:eq(11)').addClass('hd');

        $('#datarecord').click(function() {
            var selected = $('#datavizdt').find('tr.row_selected td');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            var idIndex = 2,
            versionIndex = 5;
            var id = selected.eq(idIndex).text();
            var url = '?m=Data&a=Record&dataId=' + id + '&type=' + dataTypeEnum;
            if (url) {
                $(this).attr('href', url);
            }
        });

        $('#dataflow').click(function() {
            var selected = $('#datavizdt').find('tr.row_selected td');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            var idIndex = 2,
            versionIndex = 5;
            var id = selected.eq(idIndex).text();
            var url = '?m=Data&a=Flow&dataId=' + id + '&type=' + dataTypeEnum;
            if (url) window.location = url;
        });

        $('#addlog').click(function() {
            var loggingUrl = loggingPlatformUri + '?m=Logging&a=Apply';
            addIframe(loggingUrl);
        });

        $('#editschemaBtn').click(function() {
            var selected = $('#datavizdt').find('tr.row_selected td');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            var idIndex = 2,
            orgIndex = 1,
            orgnameIndex = 7,
            idnameIndex = 3,
            versionIndex = 5;
            var id = selected.eq(idIndex).text();
            var idname = $.trim(selected.eq(idnameIndex).text().replace('[LDM]', ''));
            var org = selected.eq(orgIndex).text();
            var orgname = selected.eq(orgnameIndex).text();
            var url = '&logid=' + id + '&logName=' + idname + '&productName=' + orgname + '&productId=' + org + '&uid=' + uid;
            var loggingUrl = loggingPlatformUri + '?m=Logging&a=Edit' + url;
            addIframe(loggingUrl);
        });

        $('#applyNewDataBtn').click(function() {
            var url = '?m=Data&a=Apply&source=' + source;
            if (url) window.location = url;
        });

        $('#advancedSearchContainer').hide();
        
        $('#advancedSearchContainer .adclose').click(function() {
            $('#advancedSearchContainer').hide('fast');
        });

        $('#advancedsearchBtn').click(function() {
            $('#advancedSearchContainer').toggle('fast');
        });

        $('#applyPermissionBtn').click(function() {
            var selected = listtable._('tr.row_selected');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            $('.checkerrmsgItem').hide();
            $('#applyDataForm').get(0).reset();
            $('input[name="userName"]').val('').removeClass('cNotNull cOneName').attr('readonly', true);
            $('#selectedTableName').text($(selected[0][2]).get(0).innerHTML);
            $('input[name="entityName"]').val($(selected[0][2]).get(0).innerHTML);
            $('input[name="selectedPid"]').val(selected[0][0]);
            $('input[name="entityId"]').val(selected[0][1]);
            $('input[name="version"]').val(selected[0][5]);
            $('#addPermissionDialog').modal('show');
        });

        $('input[name="applyUser"]').change(function() {
            if ($('input[name="applyUser"]:checked').val() == 'other') {
                $('input[name="userName"]').addClass('cNotNull cOneName').attr('readonly', false);
            } else {
                $('input[name="userName"]').val('').removeClass('cNotNull cOneName').attr('readonly', true).next('.checkerrmsgItem').remove();
            }
        });

        $('a[name="save"]').click(function() {
            if (preSubmitVerifyForm('#applyDataForm') == false) {
                return;
            }
            applyData();
        });

        var select_dep = $('select#dep')[0];
        var select_prod = $('select#prod')[0];
        var select_freq = $('select#freq')[0];

        function setCookie(name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
        }

        function getCookie(name) {
            var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
            if (arr != null) return unescape(arr[2]);
            return null;
        }

        function delCookie(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null) document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
        }

        function initAdvancedSearch() {
            var dep = '-1'; //getCookie("dep")?getCookie("dep"):'-1';            
            var prod = '-1'; //getCookie("orgID")?getCookie("orgID"):'-1';       
            var freq = '-1'; //getCookie("freq")?getCookie("freq"):'-1';         
            select_dep.options.length = 1;
            select_prod.options.length = 1;
            for (i in orgMap) {
                if (orgMap[i].parentID == 0) {
                    select_dep.options.add(new Option(orgMap[i].chineseName + '[' + orgMap[i].name + ']', i));
                } else {
                    if (dep == orgMap[i].parentID + '' || dep == '-1') {
                        select_prod.options.add(new Option(orgMap[i].chineseName + '[' + orgMap[i].name + ']', i));
                    }
                }
            }
            $('.controls select option').attr('selected', false);
            $('select#dep option[value=' + dep + ']').attr('selected', true);
            $('select#prod option[value=' + prod + ']').attr('selected', true);
            $('select#freq option[value=' + freq + ']').attr('selected', true);
        }
        initAdvancedSearch();

        function buildProd(depid) {
            select_prod.options.length = 1;
            for (i in orgMap) {
                if (depid == orgMap[i].parentID + '' || depid == '-1') {
					select_prod.options.add(new Option(orgMap[i].chineseName + '[' + orgMap[i].name + ']', i));
                }
            }
        }

        select_dep.onchange = function() {
            buildProd(this.value);
        }

        $('#searchBtn').click(function() {
            param = $('#advancedSearchForm').serializeArray();
            curParam = [];
            for (i in param) {
                if (param[i].value != '-1') {
                    curParam.push(param[i]);
                }
            }
            curParam.push({
                'name': 'dataType',
                'value': dataType
            });
            updateTable(curParam);
        });

        $('#resetBtn').click(function() {                         
            initAdvancedSearch();
        });

        $('#datavizdt tr').live('mouseover', function() {
            if ($('#fastLinkDiv').length == 0) {
                $(this).children('td:eq(3)').append($('#fastLinkTemp').clone('true').attr('id', 'fastLinkDiv').show());
            } else {
                $(this).children('td:eq(3)').append($('#fastLinkDiv'));
            }
        });

        if (navigator.userAgent.toLowerCase().indexOf('ie') > 0) {
            $('#fastLinkDiv, #fastLinkTemp').remove(); //ie8 无法点击            
        }

        $('.fastLinkPanel a.fastViewStateBtn').click(function(e) {
            stopBubble(e);
            listtable.$('tr').removeClass('row_selected').find('input[type=radio]').removeAttr('checked');
            $(this).closest('tr').addClass('row_selected').find('input[type=radio]').attr('checked', 'checked');
            
            var selected = $('#datavizdt').find('tr.row_selected td');
            if (!selected.length) {
                showErrMessage('请先选择一行');
                return;
            }
            var idIndex = 2,
            versionIndex = 5;
            var id = selected.eq(idIndex).text();
            var url = '?m=Data&a=Record&dataId=' + id + '&type=' + dataTypeEnum;
            if (url) {
                $(this).attr('href', url);
            }
        });

        $('.fastLinkPanel a.fastViewDetailBtn').click(function(e) {
            stopBubble(e);
            listtable.$('tr').removeClass('row_selected').find('input[type=radio]').removeAttr('checked');
            $(this).closest('tr').addClass('row_selected').find('input[type=radio]').attr('checked', 'checked');
            var url = $(this).closest('tr').find('a.rowname').attr('href');
            if (url) {
                $(this).attr('href', url);
            }
        });

        $('.fastLinkPanel a.fastViewFlowBtn').click(function(e) {
            stopBubble(e);
            listtable.$('tr').removeClass('row_selected').find('input[type=radio]').removeAttr('checked');
            $(this).closest('tr').addClass('row_selected').find('input[type=radio]').attr('checked', 'checked');
            $('#dataflow').click();
        });

        $('#startTime').click(function() {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                maxDate: '%y-%M-#{%d}'
            });
        });

        $('#endTime').click(function() {
            WdatePicker({
                dateFmt: 'yyyy-MM-dd',
                maxDate: '%y-%M-#{%d}'
            });
        });
    });
})();
