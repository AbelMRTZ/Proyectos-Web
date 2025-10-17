<?php
// =================================================================================
// HACER REGISTRO
// =================================================================================
// FICHERO: api/post/puntuaciones.php
// MÉTODO: POST
// PETICIONES POST ADMITIDAS:
// * api/puntuaciones -> Guardar una puntuación de una partida
//      Params: nombre:nombre del jugador; puntos:puntos conseguidos; piezas:cantidad de piezas colocadas;
// =================================================================================
// INCLUSION DE LA CONEXION A LA BD
// =================================================================================
require_once('../inc/config.php'); // Constantes, etc ...
require_once('../inc/database.php');
// =================================================================================
// Se instancia la base de datos y el objeto producto
// =================================================================================
$db    = new Database();
$dbCon = $db->getConnection();
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = [];  // Almacenará el resultado.
// =================================================================================
// Se cogen los parámetros de la petición
// =================================================================================
$PARAMS = $_POST;

if( ! (isset( $PARAMS['nombre'] ) && isset( $PARAMS['puntos'] ) && isset( $PARAMS['piezas'] ) ) ) { // Faltan parámetros
  $RESPONSE_CODE    = 400; // BAD REQUEST
  $R['RESULTADO']   = 'ERROR';
  $R['CODIGO']      = $RESPONSE_CODE;
  $R['DESCRIPCION'] = 'Faltan parámetros';
}
else {
  // =================================================================================
  // Se cogen el usuario y el login:
  // =================================================================================
  $nombre = $PARAMS['nombre'];
  $puntos = $PARAMS['puntos'];
  $piezas = $PARAMS['piezas'];

  try{
    // ******** INICIO DE TRANSACCION **********
    $dbCon->beginTransaction();
    $mysql = 'insert into puntuacion(nombre,puntos,piezas) values(:NOMBRE,:PUNTOS,:PIEZAS)';
    $VPARAMS[':NOMBRE'] = $nombre;
    $VPARAMS[':PUNTOS'] = $puntos;
    $VPARAMS[':PIEZAS'] = $piezas;

    if( $db->executeStatement($mysql, $VPARAMS) ) {
      $RESPONSE_CODE    = 201; // RESOURCE CREATED INSIDE A COLLECTION
      $R['RESULTADO']   = 'OK';
      $R['CODIGO']      = $RESPONSE_CODE;
      $R['DESCRIPCION'] = 'Puntuación guardada correctamente';
      $R['NOMBRE']      = $nombre;
      $R['PUNTOS']      = $puntos;
      $R['PIEZAS']      = $piezas;
    }
    else {
      $RESPONSE_CODE    = 500; // INTERNAL SERVER ERROR
      $R['RESULTADO']   = 'ERROR';
      $R['CODIGO']      = $RESPONSE_CODE;
      $R['DESCRIPCION'] = 'Error indefinido al guardar la puntuación';
    }

    // ******** FIN DE TRANSACCION **********
    $dbCon->commit();
  } catch(Exception $e){
    // Se ha producido un error, se cancela la transacción.
    $dbCon->rollBack();
  }
}
// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
$dbCon = null;
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
print json_encode($R);
?>
