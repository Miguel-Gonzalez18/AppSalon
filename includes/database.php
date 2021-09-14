<?php
    $db = mysqli_connect('localhost', 'root', 'root1234', 'appsalon');
    if(!$db){
        die('Error de conexión');
        exit;
    }
?>