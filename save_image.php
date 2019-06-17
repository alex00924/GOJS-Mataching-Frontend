<?php

    $file_name = date('Y-m-d_').time();

    $data = $_POST['image'];
    $user_id = $_POST['user_id'];
    $type = $_POST['image_type'];

    //Save Image on disk
    if (preg_match('/^data:image\/(\w+);base64,/', $data, $type)) {
        $data = substr($data, strpos($data, ',') + 1);
        $type = strtolower($type[1]); // jpg, png, gif

        if (!in_array($type, [ 'jpg', 'jpeg', 'gif', 'png' ])) {
            throw new \Exception('invalid image type');
        }

        $data = base64_decode($data);

        if ($data === false) {
            throw new \Exception('base64_decode failed');
        }
    } else {
        throw new \Exception('did not match data URI with image data');
    }

    
    file_put_contents("upload/{$file_name}.{$type}", $data);

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

    $sql = "INSERT INTO png_image_table (user_id, file_name)
    VALUES ('{$user_id}', '{$file_name}')";

    if ($conn->query($sql) !== TRUE) {
        throw new \Exception('Can not save image in db.');
    }
    $conn->close();


    echo $file_name;
?>