(function() {
    var Queue = {
        checkFilds: {
            qname: false,
            qtype: false,
            users: false,
            queue: false,
            hadoopAccount: false,
            hadoopPasswd: false,
            qresource: false,
            qdrawRatio: false,
            waiteTime: false,
            description: false
        },
        checkForm: function(data) {
            var filds = ['qname', 'qtype', 'quserName', 'queue', 'hadoopAccount', 'hadoopPasswd', 'qresource', 'waiteTime', 'description'];
            var tempval = [];
            var i = 0;
            $.each(data, function(key, value) {
                $.each(value, function(item, val) {
                    if (item == 'value') {
                        filds[key] = val;
                    }
                });
            });
            Queue.checkFormat(filds);

        },
        checkFormat: function(data) {
            for (var i = 0; i < data.length; i++) {
                var value = data[i];
                switch (i) {
                case 0:
                    Queue.checkFilds.qname = /[\w\-]+/.test(value);
                    break;
                case 1:
                    Queue.checkFilds.qtype = /1|0/.test(value);
                    break;
                case 2:
                    Queue.checkFilds.users = /[\w\-]*/.test(value);
                    break;
                case 3:
                    Queue.checkFilds.queue = /[\w\-]+/.test(value);
                    break;
                case 4:
                    Queue.checkFilds.hadoopAccount = /[\w\-\.]+/.test(value);
                    break;
                case 5:
                    Queue.checkFilds.hadoopPasswd = /[\w]+/.test(value);
                    break;
                case 6:
                    Queue.checkFilds.qresource = /^[\d\.]+$/.test(value);
                    break;
                case 7:
                    Queue.checkFilds.qdrawRatio = /^[\d\.]+$/.test(value);
                    break;
                case 8:
                    Queue.checkFilds.waiteTime = /^[\d\.]+$/.test(value);
                    break;
                case 9:
                    Queue.checkFilds.description = /[\w]*/.test(value);
                    break;
                }
            }
        },
        postForm: function(items, qid) {
            $.ajax({
                url: '?m=Queue&a=Edit&f=ajaxUpdate',
                data: items,
                dataType: 'json',
                type: 'post',
                success: function(message) {
                    if (1 == message) {
                        showMessage('编辑提交更新成功！');
                        window.location.href = '?m=Queue&a=View&queueid=' + qid;
                    } else {
                        showErrMessage('编辑提交失败!请确认队列是否重复.');
                    }
                }
            }).error(function() {
                showErrMessage('提交失败，请联系管理员.');
            });
        },
        flag: 0
    };

    $(document).ready(function() {
        realtimeVerifyForm($('form.queueForm'));
        new bsn.AutoSuggest('users', auto_suggest_options_comma2);

        var qid = $('#queueid').text();
        var clusterid = null;
        $.ajax({
            url: '?m=Queue&a=Edit&f=ajaxFilter',
            data: {
                queueid: qid
            },
            dataType: 'json',
            type: 'post',
            success: function(data) {
                $.each(data, function(key, value) {
                    if (key == 'description') {
                        $('#' + key).html(value);
                    } else if (key == 'clusterid') {
                        $.get('?m=Queue&a=Add&f=getClusterList', function(data2) {
                            $.each(data2, function(key2, value2) {
                                if (value == value2) {
                                    $('#cluster').append('<option value="' + key2 + '" selected="true">' + value2 + '</option>');
                                } else {
                                    $('#cluster').append('<option value="' + key2 + '">' + value2 + '</option>');
                                }
                            });
                        }, 'json');
                    } else if (key == 'type' || key == 'status') {
                        if (value == 1) {
                            var result = $('#' + key + 'yes').attr('value');
                        } else {
                            var result = $('#' + key + 'no').attr('value');
                        }

                        if (result == 1) {
                            $('#' + key + 'yes').attr('checked', 'true');
                            $('#' + key + 'yes' + ':parent label').text('是');
                        } else if (result == 0) {
                            $('#' + key + 'no').attr('checked', 'ture');
                            $('#' + key + 'no' + ':parent label').text('否');
                        }
                    } else {
                        $('#' + key).attr('value', value);
                    }
                });
            }
        });

        var formFilds = {};
        $('#queue_submit_btn').live('click', function() {
            var data = $('form').serializeArray();
            Queue.flag = 0;
            Queue.checkForm(data);
            $.each(Queue.checkFilds, function(key, value) {
                if (value == false) {
                    Queue.flag++;
                }
            });
            if (Queue.flag === 0) {
                var temp = {
                    name: 'queueid',
                    value: qid
                };
                data.push(temp);
                formFilds.formData = data;
                Queue.postForm(formFilds, qid);
            } else {
                showErrMessage('输入的内容格式有误，请按正确格式输入.');
            }
        });
    });
})();