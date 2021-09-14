<?php
    function obtenerServicios():array{
        try {
            //code...
            require 'database.php';
            $sql = "SELECT * FROM servicios";
            $consulta = mysqli_query($db, $sql);

            $servicios = [];
            $i = 0;
            while ($row = mysqli_fetch_assoc($consulta)) {
                $servicios[$i]['id'] = $row['id'];
                $servicios[$i]['nombre'] = $row['nombre'];
                $servicios[$i]['precio'] = $row['precio'];

                $i++;
            }
            return $servicios;
        } catch (\Throwable $th) {
            //throw $th;
            var_dump($th);
        }
    }
    obtenerServicios();
?>