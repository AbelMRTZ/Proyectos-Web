 <?php
// FICHERO: api/get/puntuaciones.php
// =================================================================================
// PETICIONES GET ADMITIDAS:
// =================================================================================
//   api/puntuaciones/{REGISTRO_INICIAL}/{CANTIDAD_DE_REGISTROS} ---> devuelve la cantidad de registros de puntuaciones indicada a partir del registro inicial indicado

// =================================================================================
// INCLUSIÓN DE LA CONEXIÓN A LA BD
// =================================================================================
require_once('../inc/config.php'); // Constantes, etc ...
require_once('../inc/database.php');
// =================================================================================
// Se instancia la BD y se pilla la conexión
// =================================================================================
$db    = new Database(); // Base de datos
$dbCon = $db->getConnection(); // Conexión a la base de datos
// =================================================================================
// CONFIGURACIÓN DE SALIDA JSON Y CORS PARA PETICIONES AJAX
// =================================================================================
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE");
header("Content-Type: application/json; charset=UTF-8");
// =================================================================================
// SE ANALIZA LA PETICIÓN Y SE SEPARA RECURSO Y PARÁMETROS DE LA PETICIÓN
// =================================================================================
analizarPeticion($_SERVER['QUERY_STRING'], $RECURSO, $PARAMS);
// =================================================================================
// RECURSO QUE VIENE EN LA PETICIÓN HTTP
// =================================================================================
if(strlen($RECURSO) > 0)
    $RECURSO = explode("/", substr( $RECURSO, 1 ) );
else
    $RECURSO = [];
// =================================================================================
// SE PREPARA LA RESPUESTA
// =================================================================================
$R             = [];  // Almacenará el resultado.
$RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK
// =================================================================================
// SE PREPARA EL SQL
// =================================================================================
$mysql  = 'select count(*) as total from puntuacion order by puntos desc, piezas asc ';
// Se lanza la petición para saber el total de registros de puntuaciones
$RESPUESTA = $db->select($mysql);
if( $RESPUESTA['CORRECTO'] ) // execute query OK
{
    $R['TOTAL_REGISTROS'] = $RESPUESTA['RESULT'][0]['total'];

    // =================================================================================
    // SE COGE DE LA URL EL REGISTRO INICIAL DE PUNTUACIÓN Y LA CANTIDAD DE REGISTROS
    // =================================================================================
    $REG_INICIAL = array_shift( $RECURSO );
    $CANT_REGS   = array_shift( $RECURSO );

    $mysql  = 'select * from puntuacion order by puntos desc, piezas asc ';

    if( is_numeric( $REG_INICIAL ) && is_numeric( $CANT_REGS ) ) {
        // se añade el conjunto de registro a obtener
        $mysql .= 'limit ' . $REG_INICIAL . "," . $CANT_REGS;
    }

    // Se lanza la petición
    $RESPUESTA = $db->select($mysql);
    if( $RESPUESTA['CORRECTO'] ) // execute query OK
    {
        $RESPONSE_CODE    = 200;
        $R['RESULTADO']   = 'OK';
        $R['REG_INICIAL'] = $REG_INICIAL;
        $R['CANT_REGS']   = $CANT_REGS;
        $R['FILAS']       = $RESPUESTA['RESULT'];
    }
    else
    {
        $RESPONSE_CODE    = 500;
        $R['RESULTADO']   = 'ERROR' ;
        $R['DESCRIPCION'] = 'Se ha producido un error en el servidor al ejecutar la consulta.';
        $R['ERROR']       = $RESULTADO['ERROR'];
    }
}
else
{
    $RESPONSE_CODE    = 500;
    $R['RESULTADO']   = 'ERROR' ;
    $R['DESCRIPCION'] = 'Se ha producido un error en el servidor al ejecutar la consulta.';
    $R['ERROR']       = $RESULTADO['ERROR'];
}

$R = ['CODIGO'=>$RESPONSE_CODE] + $R;
// =================================================================================
// SE CIERRA LA CONEXION CON LA BD
// =================================================================================
$dbCon = null;
// =================================================================================
// SE DEVUELVE EL RESULTADO DE LA CONSULTA
// =================================================================================
http_response_code($RESPONSE_CODE);
echo json_encode($R);
?>
