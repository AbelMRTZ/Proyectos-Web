 <?php
// FICHERO: api/get/piezas.php
// =================================================================================
// PETICIONES GET ADMITIDAS:
// =================================================================================
//   api/piezas/{CANTIDAD}  -------------------> devuelve tantas piezas como se indique
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
// SE PREPARA LA RESPUESTA
// =================================================================================
$R             = [];  // Almacenará el resultado.
$RESPONSE_CODE = 200; // código de respuesta por defecto: 200 - OK
// =================================================================================
// =================================================================================
// FUNCIONES AUXILIARES
// =================================================================================
// =================================================================================

// =================================================================================
// Rota una pieza 90 grados a la derecha
// =================================================================================
// $pieza -> Pieza a rotar
// Devuelve la pieza rotada
function rotar90( $pieza ) {
    $piezaRotada = $pieza;

    // se coge el tamaño de la matriz tam x tam
    $tam = count($pieza);
    // Se rota la pieza
    for($i = 0; $i < $tam; $i++) {
        for($j = 0; $j < $tam; $j++) {
            $piezaRotada[ $j ][ ($tam - 1) - $i ] = $pieza[$i][$j];
        }
    }

    return $piezaRotada;
}
// =================================================================================
// Rota una pieza 270 grados a la derecha o, lo que es lo mismo, 90 a la izquierda (rota -90 grados)
// =================================================================================
// $pieza -> Pieza a rotar
// Devuelve la pieza rotada
function rotar270( $pieza ) {
    $piezaRotada = $pieza;

    // se coge el tamaño de la matriz tam x tam
    $tam = count($pieza);
    // Se rota la pieza
    for($i = 0; $i < $tam; $i++) {
        for($j = 0; $j < $tam; $j++) {
            $piezaRotada[ ($tam - 1) - $j ][ $i ] = $pieza[$i][$j];
        }
    }

    return $piezaRotada;
}

// =================================================================================
// Asigna colores aleatorios (de los posibles) a las celdas de la pieza
// =================================================================================
function colorear( $pieza ) {
    $COLORES = ['#2D3','#FD2','#7BF','#F44']; // colores posibles
    $tam     = count($pieza);

    for($i = 0; $i < $tam; $i++) {
        for($j = 0; $j < $tam; $j++) {
            if($pieza[$i][$j] != 0) { // hay que asignar un color al azar
                $pos           = rand(0, count($COLORES) - 1);
                $pieza[$i][$j] = $COLORES[ $pos ];
            }
        }
    }

    return $pieza;
}

// =================================================================================
// Centra la pieza en la matriz
// =================================================================================
/******
 * Vertical:
 * - Si la segunda fila está vacía y la última llena, se desplaza hacia arriba una fila
 * - Si la penúltima fila está vacía y la primera llena, se desplaza hacia abajo una fila
 *
 * Horizontal:
 * - Si la segunda columna está vacía y la última llena, se desplaza hacia la izquierda una fila
 * - Si la penúltima columna está vacía y la primera llena, se desplaza hacia la derecha una fila
 * */
// $pieza -> Pieza a centrar
// Devuelve la pieza centrada
function centrarPieza( $pieza ) {
    // -----------------------
    // Centrado vertical
    // -----------------------
    $segundaVacia = true;
    $fila         = 1;
    $i            = 0;
    while( $segundaVacia && ($i < count($pieza) ) ) {
        if( $pieza[ $fila ][ $i ] != 0 )
            $segundaVacia = false;
        $i++;
    }

    // Comprobación de la penúltima fila
    $penultimaVacia = true;
    $fila           = count( $pieza ) - 2;
    $i              = 0;
    while( $penultimaVacia && ($i < count($pieza) ) ) {
        if( $pieza[ $fila ][ $i ] != 0 )
            $penultimaVacia = false;
        $i++;
    }

    // if $segundaVacia y $penultimaVacia tienen el mismo valor se supone que la pieza está centrada. Si no, hay que centrarla.
    if( $segundaVacia != $penultimaVacia ) {
        if( $segundaVacia ) {
            $pieza = array_merge(array_slice($pieza, 1), array_slice($pieza, 0, 1));
        }
        else {
            $pieza = array_merge(array_slice($pieza, count($pieza) - 1, 1), array_slice($pieza, 0, count($pieza) - 1));
        }
    }

    // -----------------------
    // Centrado horizontal
    // -----------------------
    $pieza        = rotar90( $pieza );
    $segundaVacia = true;
    $fila         = 1;
    $i            = 0;
    while( $segundaVacia && ($i < count($pieza) ) ) {
        if( $pieza[ $fila ][ $i ] != 0 )
            $segundaVacia = false;
        $i++;
    }

    // Comprobación de la penúltima fila
    $penultimaVacia = true;
    $fila           = count( $pieza ) - 2;
    $i              = 0;
    while( $penultimaVacia && ($i < count($pieza) ) ) {
        if( $pieza[ $fila ][ $i ] != 0 )
            $penultimaVacia = false;
        $i++;
    }

    // if $segundaVacia y $penultimaVacia tienen el mismo valor se supone que la pieza está centrada. Si no, hay que centrarla.
    if( $segundaVacia != $penultimaVacia ) {
        if( $segundaVacia ) {
            $pieza = array_merge(array_slice($pieza, 1), array_slice($pieza, 0, 1));
        }
        else {
            $pieza = array_merge(array_slice($pieza, count($pieza) - 1, 1), array_slice($pieza, 0, count($pieza) - 1));
        }
    }

    // Se rota -90 grados a la izquierda para volverla a dejar como estaba
    $pieza = rotar270( $pieza );

    return $pieza;
}

// =================================================================================
// =================================================================================
// FIN FUNCIONES AUXILIARES
// =================================================================================
// =================================================================================

// =================================================================================
// RECURSO QUE VIENE EN LA PETICIÓN HTTP
// =================================================================================
if(strlen($_GET[_REC_]) > 0)
    $RECURSO = explode("/", substr($_GET[_REC_],1));
else
    $RECURSO = [];

// Se saca la cantidad de piezas a devolver de la petición
if( count( $RECURSO ) == 1 )
    $CANTIDAD = array_shift($RECURSO); // se pilla la cantidad de fichas
else
    $CANTIDAD = 3;

// ============================================================
// RESPUESTA
// ============================================================
// se prepara la respuesta
$RESPONSE_CODE  = 200;
$R['RESULTADO'] = 'OK';
$R['FILAS']     = []; // el array de piezas vacío inicialmente
// ============================================================
// Total de piezas
$mysql = 'SELECT COUNT(*) as total from piezas';
$RESPUESTA = $db->select($mysql);
if( $RESPUESTA['CORRECTO'] ) { // execute query OK
    $TOTAL_PIEZAS = $RESPUESTA['RESULT'][0]['total'];

    // Ahora se sacan los distintos grupos de piezas
    $mysql = 'SELECT prioridad, count(*) as total FROM piezas group by prioridad order by total desc;';
    $RESPUESTA = $db->select( $mysql );
    if( $RESPUESTA['CORRECTO'] ) { // execute query OK
        $PIEZAS = $RESPUESTA['RESULT'];

        // Para cada pieza se saca un número aleatorio para ver de qué prioridad es la pieza a seleccionar
        for( $i = 0; $i < $CANTIDAD; $i++ ) {
            $valorAle = rand(1,1000) / 1000;
            $prioridad = -1;

            // Se busca de qué prioridad será
            $piezasAcumuladas = 0;
            $j = 0;
            while( $j < count( $PIEZAS ) && $prioridad == -1 ) {
                $piezasAcumuladas += $PIEZAS[ $j ]['total'];

                if( $valorAle <= ($piezasAcumuladas / $TOTAL_PIEZAS) ) {
                    $prioridad = $PIEZAS[ $j ]['prioridad'];
                }
                $j++;
            }

            // Ya se tiene la prioridad para la primera pieza
            // Se hace la petición
            $mysql = 'SELECT forma FROM piezas WHERE prioridad=:PRIORIDAD ORDER BY RAND() LIMIT 1;';
            $RESPUESTA = $db->select($mysql, [':PRIORIDAD'=>$prioridad]);
            if( $RESPUESTA['CORRECTO'] ) { // execute query OK
                $matrizPieza = json_decode( $RESPUESTA['RESULT'][0]['forma'] );

                // Se ROTA la pieza
                // Se selecciona un número aleatorio de veces a rotar la pieza
                $veces = rand(0,3);
                for( $vez = 0; $vez < $veces ; $vez++){
                    $matrizPieza = rotar90( $matrizPieza );
                }

                // Se COLOREA la pieza. Con el do-while y la función comprobarColores se consigue que las piezas
                // generadas aleatoriamente no tengan grupos de más de dos celdas con el mismo color
                do {
                    $matrizPieza = colorear( $matrizPieza );
                } while( count(comprobarColores( $matrizPieza )) > 0 );

                // se centra la pieza en la matriz
                $matrizPieza = centrarPieza( $matrizPieza );
                // se añade la pieza rotada y con colores
                $R['FILAS'][] = $matrizPieza;
            }
        }
    }
}

// =================================================================================
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
