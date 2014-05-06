(function() {
    $(document).ready(function() {
        $.get('?m=Queue&a=Add&f=getClusterList', function(data) {
            $.each(data, function(key, value) {
                $('#cluster').append('<option value="' + key + '">' + value + '</option>');
            });
        }, 'json');
    });
})();