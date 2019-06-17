<?php

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

    $type = $_GET['type'];
    $dbdata = array();
    $sql = '';
    if( $type == 'data_name')
    {
        $sql = 'select id, file_name from object_image_table';
    }
    else if( $type == 'data_obj')
    {
        $id = $_GET['id'];
        $sql = 'select obj_data from object_image_table where id='.$id;
    }
    else if( $type == 'png_name')
    {
        $sql = 'select file_name from png_image_table';
    }


    if ($result = $conn->query($sql)) {

        /* fetch object array */
        while ($row = $result->fetch_assoc()) {
            $dbdata[]=$row;
        }
        /* free result set */
        $result->close();
    }

    $conn->close();
    echo json_encode($dbdata);
?>