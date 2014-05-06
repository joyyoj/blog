(function() {
    $(document).ready(function() {
        setup_hash();
        $(window).bind('hashchange', setup_hash);
    });

    /* 以动画的方式跳转到hash */
    function setup_hash() {
        /* 根据url获取锚点元素 */
        var $target = $('#' + location.hash.slice(1));
        if ($target && $target.length) {
            /* 开始滚动啦 */
            var targetOffset = $target.offset().top;
            $('html,body').animate({
                scrollTop: targetOffset - 100
                /* 减去100，是因为顶部导航栏会遮挡 */
            }, 1000);

            /* 将锚点所在的行标红 */
            var $tr = $target.closest('tr');
            $tr.attr('style', 'color:red;');

            /* 重置上次锚点的样式 */
            if (arguments.callee.prevTerm) {
                arguments.callee.prevTerm.attr('style', '');
            }

            /* 保存当前行，下次重置它 */
            arguments.callee.prevTerm = $tr;
        }
    }
})();