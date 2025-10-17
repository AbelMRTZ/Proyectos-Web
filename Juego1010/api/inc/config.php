<?php
// ============================================================
// ============================================================
// PARAMETROS GENERALES DE CONFIGURACION PARA EL SERVIDOR
// ============================================================
// ============================================================
// CONSTANTES DE TEXTO. SE PUEDEN DECLARAR CON define().
define("_REC_", "_rec_"); // nombre del parámetro en la petición que trae la parte de recurso de la URL
// LAS CONSTANTES NUMÉRICAS NO SE PUEDEN DECLARAR CON define().
$FILAS = 10; // filas de la matriz de juego
$COLS  = $FILAS; // columnas de la matriz de juego
// ============================================================
// ============================================================
// FUNCIONES AUXILIARES
// ============================================================
// ============================================================

// =================================================================================
// Analiza el parámetro $_SERVER["QUERY_STRING"] y devuelve la parte de recurso y la de
// los parámetros de la petición ($_GET)
// =================================================================================
function analizarPeticion($queryString, &$recurso, &$params){
    parse_str($_SERVER["QUERY_STRING"], $prms);

    $recurso = $prms[_REC_];
    unset($prms[_REC_]);
    $params = $prms;
}

// =================================================================================
// Sanatiza lo textos
// =================================================================================
function sanatize($valor)
{
    return urldecode('' . $valor);
}

/*********************************************
* Función recursiva que recorre la matriz en la dirección X e Y que se le indica buscando celdas del color indicado
* Parte de la celda indicada por (x,y)
* Las celdas deben ser adyacentes en horizontal y/o vertical, no en diagonal.
* Si sólo se elimina un color, la puntuación se multiplica por 2. Si son dos colores, por 4.
* Si el número de celdas que se eliminan es 3, se devuelve esa puntuación
* Si el número de celdas eliminadas es mayor que 3, se devuelve como puntuación el número de celdas x 2
*
* Recibe:
* - matrizJuego: La matriz de celdas del juego. La recibe por referencia
* - color: color buscado
* - i,j: Posición (fila=i,columna=j) de la celda con el color en la que empezar a buscar entre sus vecinos
* Devuelve: Las celdas que coincidan en color con la celda (x,y)
*
* */
function buscarCeldas( &$matrizJuego, $color, $i, $j ) {
    $filas  = count( $matrizJuego );
    $cols   = count( $matrizJuego[ 0 ] );
    $celdas = []; // celdas con el mismo color

    if( $i > -1 && $i < $filas && $j > -1 && $j < $cols ) { // si las coordenadas están dentro de los límites ...
        if( $matrizJuego[ $i ][ $j ] == $color ){
            $celdas[] = ["fila"=>$i,"col"=>$j,"color"=>$color]; // se añade la celda como celda a quitar
            $matrizJuego[$i][$j] = 0; // se borra el color porque ya se ha contabilizado

            // Ahora se busca de forma recursiva en las cuatro direcciones: norte, este, sur, oeste
            $celdas = array_merge( $celdas, buscarCeldas($matrizJuego, $color, $i - 1  , $j      ) ); // arriba
            $celdas = array_merge( $celdas, buscarCeldas($matrizJuego, $color, $i      , $j + 1.0) ); // derecha
            $celdas = array_merge( $celdas, buscarCeldas($matrizJuego, $color, $i + 1.0, $j      ) ); // abajo
            $celdas = array_merge( $celdas, buscarCeldas($matrizJuego, $color, $i      , $j - 1  ) ); // izquierda
        }
    }

    return $celdas;
}

/*********************************************
* Recorre la matriz mirando si hay más de tres celdas con el mismo color para eliminarlas.
* Las celdas deben ser adyacentes en horizontal y/o vertical, no en diagonal.
* Si sólo se elimina un color, la puntuación se multiplica por 2. Si son dos colores, por 4.
* Si el número de celdas que se eliminan es 3, se devuelve esa puntuación
* Si el número de celdas eliminadas es mayor que 3, se devuelve como puntuación el número de celdas x 2
*
* Recibe:
* - matriz: La matriz de juego
* Devuelve: el array de celdas a quitar
*
* */
function comprobarColores( $matriz ) {
    $matrizJuego   = $matriz;
    $filas         = count( $matrizJuego );
    $cols          = count( $matrizJuego[ 0 ] );
    $celdasAQuitar = [];
    $celdasColor   = [];

    for( $i = 0; $i < $filas; $i++ ) {
        for( $j = 0; $j < $cols; $j++ ) {
            if( $matrizJuego[ $i ][ $j ] != 0 ) {
                $celdasColor = buscarCeldas( $matrizJuego, $matriz[ $i ][ $j ], $i, $j ); // se empieza a buscar en esta celda

                if( count( $celdasColor ) >= 3 ) { // hay que eliminar las celdas
                    $celdasAQuitar = array_merge( $celdasAQuitar, $celdasColor );
                }
                else {
                    // Si son menos de dos celdas del mismo color no las contabilizamos y tampoco las restauramos para no volver a visitarlas
                    $celdasColor = []; // se reinicia la lista de celdas del mismo color
                }
            }
        }
    }

    return $celdasAQuitar;
}
?>