$(document).ready(function() {
    window.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: {
            name: 'xml',
            alignCDATA: true
        },
        lineNumbers: true,
        onCursorActivity: function() {
            window.editor.matchHighlight('CodeMirror-matchhighlight');
        }
    });

    $('.xmlEdit').click(function() {
        selectBtnBox('abc');
    });
    $('.xmlCheck').click(function() {
        selectBtnBox('TestBox');
        xmlCheck();
    });
    $('.xmlTest').click(function() {
        selectBtnBox('TestOLBox');
        xmlTest();
    });
    $('.xmlTestOL').click(function() {
        selectBtnBox('SaveBox');
        xmlTestOL();
    });

    $('.xmlSave').click(function() {
        selectBtnBox('');
    });

    $('.srhList').click(function() {
        srhList();
    });
    $('.srhContent').click(function() {
        srhContent();
    });

    $('.getFile').click(function() {
        getFile();
    });

    $('#dialogbox').dialog({
        autoOpen: false,
        width: 600,
        buttons: {
            'Ok': function() {
                $(this).dialog('close');
            },
            'Cancel': function() {
                $(this).dialog('close');
            }
        }
    });

    $('.sample_log').focus(function() {}).blur(function() {});

});

function xmlCheck() {
    $('#dialogbox').html('<img src="res/img/load.gif" />');
    $('.log_rst').val('Loading...');
    var datavalue = 'log_name=' + $('.log_name').val() + '&department=' + $('.department').val();
    datavalue += '&product=' + $('.product').val() + '&api_version=' + $('.api_version').val();
    datavalue += '&schema_content=' + encodeURIComponent(window.editor.getValue() + '\n') + '&sample_log=' + encodeURIComponent($('.sample_log').val());

    $.ajax({
        type: 'POST',
        data: datavalue,
        url: '?m=Logging&a=Edit&date=' + Math.random(0, 1),
        error: function(jqXHR, textStatus, errorThrown) {},
        success: function(data) {
            var RST = eval('(' + data + ')');
            if (RST.stat == 1) {
                window.data = eval('(' + data + ')');
                window.fileurl = RST.data;
                $('.log_rst').val('执行成功。');
                $('.getFile').removeClass('hd');
            } else {
                $('.log_rst').val('执行失败。');
            }
        }
    });

}
function xmlTest() {
    $('#dialogbox').html('<img src="res/img/load.gif" />');
    $('.log_rst').val('Loading...');
    var datavalue = 'log_name=' + $('.log_name').val() + '&department=' + $('.department').val();
    datavalue += '&product=' + $('.product').val() + '&api_version=' + $('.api_version').val();
    datavalue += '&sample_lines=' + $('.sample_lines').val() + '&cluster_name=' + $('.cluster_name').val();
    datavalue += '&associated=' + $('.associated').val() + '&log_hdfs_address=' + $('.log_hdfs_address').val();
    datavalue += '&schema_content=' + encodeURIComponent(window.editor.getValue() + '\n');

    $.ajax({
        type: 'POST',
        data: datavalue,
        url: '?m=Logging&a=Edit&f=xmlTest&date=' + Math.random(0, 1),
        error: function(jqXHR, textStatus, errorThrown) {},
        success: function(data) {
            var RST = eval('(' + data + ')');
            if (RST.stat == 1) {
                window.data = eval('(' + data + ')');
                window.fileurl = RST.data;
                $('.log_rst').val('执行成功。');
                $('.getFile').removeClass('hd');
            } else {
                $('.log_rst').val('执行失败。');
            }
        }
    });

}

function xmlTestOL() {
    $('#dialogbox').html('<img src="res/img/load.gif" />');
    $('.log_rst').val('Loading...');
    var datavalue = 'log_name=' + $('.log_name').val() + '&department=' + $('.department').val();
    datavalue += '&product=' + $('.product').val() + '&api_version=' + $('.api_version').val();
    datavalue += '&cluster_name=' + $('.cluster_name').val();
    datavalue += '&associated=' + $('.associated').val() + '&log_hdfs_address=' + $('.log_hdfs_address').val();
    datavalue += '&schema_content=' + encodeURIComponent(window.editor.getValue() + '\n');

    $.ajax({
        type: 'POST',
        data: datavalue,
        url: '?m=Logging&a=Edit&f=xmlTestOL&date=' + Math.random(0, 1),
        error: function(jqXHR, textStatus, errorThrown) {},
        success: function(data) {
            var RST = eval('(' + data + ')');
            if (RST.stat == 1) {
                window.data = eval('(' + data + ')');
                window.fileurl = RST.data;
                $('.log_rst').val('执行成功。');
                $('.getFile').removeClass('hd');
            } else {
                $('.log_rst').val('执行失败。');
            }
        }
    });

}

function selectBtnBox(box) {
    $('.btnBox').addClass('hd');
    $('.' + box).removeClass('hd');
}

function getFile() {
    $('#dialogbox').dialog('open');
    var datavalue = 'fileurl=' + encodeURIComponent(window.fileurl);

    $.ajax({
        type: 'POST',
        data: datavalue,
        url: '?m=Logging&a=Edit&f=getFile&date=' + Math.random(0, 1),
        error: function(jqXHR, textStatus, errorThrown) {},
        success: function(data) {
            $('#dialogbox').html(data);
        }
    });

}

function srhList() {
    $('.schema_srh_list').val('Loading...');
    var datavalue = 'zk_path=' + $('.srhListbox .zk_path').val() + '&zk_address=' + $('.srhListbox .zk_address').val();

    $.ajax({
        type: 'POST',
        data: datavalue,
        url: '?m=Logging&a=Edit&f=srhList&date=' + Math.random(0, 1),
        error: function(jqXHR, textStatus, errorThrown) {},
        success: function(data) {
            var RST = eval('(' + data + ')');
            if (RST.stat == 1) {
                window.data = eval('(' + data + ')');
                window.fileurl = RST.data;
                $('.schema_srh_list').val(RST.data);
            } else {
                $('.schema_srh_list').val('执行失败。');
            }
        }
    });

}
function srhContent() {
    $('.schema_srh_content').val('Loading...');
    var datavalue = 'zk_path=' + $('.srhContentbox .zk_path').val() + '&zk_address=' + $('.srhContentbox .zk_address').val();
    datavalue += '&schema_version=' + $('.srhContentbox .schema_version').val();

    $.ajax({
        type: 'POST',
        data: datavalue,
        url: '?m=Logging&a=Edit&f=srhContent&date=' + Math.random(0, 1),
        error: function(jqXHR, textStatus, errorThrown) {},
        success: function(data) {
            var RST = eval('(' + data + ')');
            if (RST.stat == 1) {
                window.data = eval('(' + data + ')');
                window.fileurl = RST.data;
                $('.schema_srh_content').val(RST.data);
            } else {
                $('.schema_srh_content').val('执行失败。');
            }
        }
    });

}