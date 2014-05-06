<?php

$prefix = $_GET['prefix'];
exec("./completor $prefix", $out, $ret);
//exec("./completor_client $prefix", $out, $ret);
echo $out[0];
file_put_contents("request", $prefix . "\t" . $out[0] . "\n", FILE_APPEND);
