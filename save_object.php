<?php

    $file_name = date('Y-m-d_').time();

    $data = $_POST['data'];
    $user_id = $_POST['user_id'];

    //Save image information on db
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "match_db";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        throw new \Exception($conn->connect_error);
    } 

    $sql = "INSERT INTO object_image_table (user_id, obj_data, file_name)
    VALUES ('{$user_id}', '{$data}' ,'{$file_name}')";

    if ($conn->query($sql) !== TRUE) {
        throw new \Exception('Can not save image in db.');
    }
    $conn->close();


    echo $file_name;
?>