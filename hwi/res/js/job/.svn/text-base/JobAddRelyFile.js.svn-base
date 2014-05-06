function sumbmitForm(isUpdate) {
    if ($('#retryCount').val() > 100) {
        showErrMessage('重试次数要求小于等于100次');
        $('.btn-danger').removeClass('disabled');
        return;
    }
    if ($('#retryCount').val() > 0 && $('#retryInterval').val() < 10) {
        showErrMessage('重试间隔要求大于等于10分钟');
        $('.btn-danger').removeClass('disabled');
        return;
    }
    var delayTime = $('#delayTime').val();
    if ($('#delayTime').val() == '') {
        $('#delayTime').val('00:00:00');
    }
    
    if (isUpdate) {
        targetUrl = '?m=Job&a=AddRelyFile&f=updateRelyFile';
    } else {
        targetUrl = '?m=Job&a=AddRelyFile&f=createRelyFile';
    }
    var data = $('form[name="BaseInfo"]').serializeArray();
    $.post(targetUrl, {
        'formData': data
    }, function(ret) {
        if (ret.status == 'success') {
            window.location = '?m=Job&a=List&type=download';
            showMessage('操作成功!');
        } else {
            showErrMessage(ret.message);
        }
        $('.btn-danger').removeClass('disabled');
    }, 'json').error(function() {
        showErrMessage('操作失败，或者联系管理员');
        $('.btn-danger').removeClass('disabled');
    });
}

function syncCycleAndStatus() {
    if ($('select[name="run_cycle"]').val() == 0) {
        $('#status').attr('value', 11).attr('disabled', true);
        $('input[name="status"]').attr('disabled', false);
    } else {
        $('#status').attr('disabled', false);
        $('input[name="status"]').attr('disabled', true);
    }
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
    syncCycleAndStatus();
    realtimeVerifyForm($('#BaseInfoForm'));
    $('#tipToggle').popover({
        'placement': 'right'
    });
    $('#submitFormBtn').click(function() {
        if (preSubmitVerifyForm('#BaseInfoForm') == false) {
            return;
        }
        $(this).addClass('disabled');
        sumbmitForm();
    });
    $('#updateFormBtn').click(function() {
        if (preSubmitVerifyForm('#BaseInfoForm') == false) {
            return;
        }
        $(this).addClass('disabled');
        sumbmitForm(true);
    });
    $('#editFormBtn').click(function() {
        $('#delayTime').css('background-color', '#fff').css('cursor', 'text');
        $('input,textarea,select').attr('disabled', false);
        $('select[name="product_id"]').attr('disabled', true);
        $('input[name="english_name"]').attr('readonly', true);
        $('select[name="run_cycle"]').attr('disabled', true);
        $('#updateFormBtn').show();
        $(this).hide();
    });
    $('#retryCount').blur(function() {
        if ($(this).val() == 0) {
            $('#retryInterval').val(0).attr('readonly', true);
        } else {
            $('#retryInterval').attr('readonly', false);
        }
    });
    $('select[name="run_cycle"]').change(function() {
        syncCycleAndStatus();
    });
    $('#delayTime').css('background-color', '#fff').css('cursor', 'text');

    if (from == 'view') {
        $('input,textarea,select').attr('disabled', true);
    }
});
