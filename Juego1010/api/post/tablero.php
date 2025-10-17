<?php
// =================================================================================
// HACER LOGIN
// =================================================================================
// FICHERO: api/post/tablero.php
// MÉTODO: POST
// * api/tablero -> Comprobar si hay grupos de 3 ó más celdas del mismo color consecutivas en horizontal o vertical y los devuelve
//      Params: matriz:matriz 10x10 de celdas que representa el tablero de juego
// =================================================================================
// INCLUSION DE FICHEROS AUXILIARES
// =================================================================================
require_once('../inc/config.php'); // Constantes, etc ...
// =================================================================================
// CONFIGURACION DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// Se toman la parte de la url que viene a partir del recurso principal
// =================================================================================
$RECURSO = explode("/", substr($_GET[ _REC_ ],1));
// =================================================================================
// Se prepara la respuesta
// =================================================================================
$R = [];  // Almacenará el resultado.
// =================================================================================
// Se cogen los parámetros de la petición
// =================================================================================
$PARAMS = $_POST;
// =================================================================================
if( !isset($PARAMS['matriz']) ) {
  $RESPONSE_CODE    = 400;
  $R['RESULTADO']   = 'ERROR';
  $R['CODIGO']      = $RESPONSE_CODE;
  $R['DESCRIPCION'] = 'Parámetros incorrectos';
}
else {
  $RESPONSE_CODE  = 200;
  $R['RESULTADO'] = 'OK';
  // Se buscan los grupos de 3 ó más celdas del mismo color y se guardan en la respuesta del servidor
  $R['FILAS']     = comprobarColores( json_decode( $PARAMS['matriz'] ) );
}

// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
print json_encode($R);
?>
