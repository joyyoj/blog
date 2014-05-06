(function() {
    var Queue = {
        checkFilds: {
            qname: false,
            qtype: false,
            users: false,
            grouphub: false,
            queue: false,
            hadoopAccount: false,
            hadoopPasswd: false,
            qresource: false,
            qdrawRatio: false,
            waiteTime: false,
            description: false
        },
        checkForm: function(data) {
            var filds = ['qname', 'qtype', 'quserName', 'grouphub', 'queue', 'hadoopAccount', 'hadoopPasswd', 'qresource', 'waiteTime', 'description'];
            var tempval = [];
            var i = 0;
            $.each(data,
            function(key, value) {
                $.each(value,
                function(item, val) {
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
                    Queue.checkFilds.grouphub = /[\d]{1,4}/.test(value);
                    break;
                case 4:
                    Queue.checkFilds.queue = /[\w\-]+/.test(value);
                    break;
                case 5:
                    Queue.checkFilds.hadoopAccount = /[\w\-\.]+/.test(value);
                    break;
                case 6:
                    Queue.checkFilds.hadoopPasswd = /[\w]+/.test(value);
                    break;
                case 7:
                    Queue.checkFilds.qresource = /^[\d\.]+$/.test(value);
                    break;
                case 8:
                    Queue.checkFilds.qdrawRatio = /^[\d\.]+$/.test(value);
                    break;
                case 9:
                    Queue.checkFilds.waiteTime = /^[\d\.]+$/.test(value);
                    break;
                case 10:
                    Queue.checkFilds.description = /[\w]*/.test(value);
                    break;
                }
            }
        },
        postForm: function(items) {
            $.ajax({
                url: '?m=Queue&a=Add',
                data: items,
                dataType: 'json',
                type: 'post',
                success: function(message) {
                    if ( - 1 != message) {
                        showMessage('提交成功！');
                        window.location.href = '?m=Queue&a=List';
                    } else {
                        showErrMessage('提交失败!请确认队列是否重复.');
                    }
                }
            }).error(function() {
                showErrMessage('提交失败，请联系管理员！');
            });
        },
        checking: function(val) {
            switch (val) {
            case Queue.sampleArr[0]:
                return true;
            }
        },
        sampleArr: [],
        flag: 0
    };

    $(document).ready(function() {
        realtimeVerifyForm($('form.queueForm'));
        new bsn.AutoSuggest('userList', auto_suggest_options_comma2);
        $.get('?m=Queue&a=Add&f=getCluster', function(data) {
            $.each(data, function(key, value) {
                $('#cluster').append('<option value="' + key + '">' + value + '</option>');
            });
        }, 'json');
        var formFilds = {};
        $('#queue_submit_btn').live('click', function() {
            $('#add_queue_panel dl dd input').each(function() {
                var val = $(this).val();
                if (val == '请输入你的队列所属账号') {
                    $(this).val('');
                }
            });
            var data = $('form').serializeArray();
            Queue.flag = 0;

            Queue.checkForm(data);

            $.each(Queue.checkFilds, function(key, value) {
                if (value == false) {
                    Queue.flag++;
                }
            });
            if (Queue.flag === 0) {
                formFilds.formData = data;
                Queue.postForm(formFilds);
            } else {
                showErrMessage('输入的内容格式有误，请按正确格式输入.');
            }

        });

        $('#queue_reset_btn').live('click', function() {
            $('dl.radio_wrap dd input').each(function() {
                $(this).removeAttr('checked');
            });
        });

        var tempval = [];
        var len = $('#add_queue_panel dl dd input').length;
        $('#add_queue_panel dl dd input').each(function() {
            tempval.push($(this).val());
        });

        var val = null,
        oval = null,
        value = null,
        ilen = tempval.length;

        $('#add_queue_panel dl dd input').live('focus', function() {
            if ($(this).val()) {
                val = $(this).val();
            }
            for (var i = 0; i < ilen; i++) {
                if (val != '' && val == tempval[i]) {
                    oval = tempval[i];
					$(this).val('');
                }
            }
        }).on('blur', function() {
            value = $(this).val();
            if (value == '') {
                for (var j = 0; j < len; j++) {
                    if (tempval[j] == val) {
                        $(this).val(tempval[j]).css({
                            'color': '#e3e3e3'
                        });
                        oval = val;
                    } else {
                        $(this).val(oval).css({
                            'color': '#e3e3e3'
                        });
                    }
                }
            }
        }).on('keydown', function() {
            $(this).css({
                'color': '#333'
            });
        });

        $('.yes').live('click', function() {                                      
            $('input', this).attr('checked', 'true');                                                                       
        });

        $('.no').live('click', function() {                                         
            $('input', this).attr('checked', 'true');                                                                       
        });
    });
})();
