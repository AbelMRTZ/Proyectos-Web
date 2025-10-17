package com.example.ns;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity2 extends AppCompatActivity {

    // Declaración de variables para los componentes de la interfaz de usuario
    private RadioGroup opcionGrupo;
    private RadioButton opcionUnBit, opcionOchoBit;
    private EditText campoA, campoB, campoC;
    private Button botonCalcular, botonBorrar;
    private ImageButton botonRegresar;
    private boolean modoUnBit = true; // Bandera que indica si estamos en el modo de 1 bit

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2); // Carga el diseño de la actividad

        // Inicialización de las vistas (componentes de la interfaz)
        opcionGrupo = findViewById(R.id.radiogroup);
        opcionUnBit = findViewById(R.id.unbit);
        opcionOchoBit = findViewById(R.id.ochobit);
        campoA = findViewById(R.id.a);
        campoB = findViewById(R.id.b);
        campoC = findViewById(R.id.c);
        botonCalcular = findViewById(R.id.calcular);
        botonBorrar = findViewById(R.id.borrar);
        botonRegresar = findViewById(R.id.flecha);

        // Inicialmente, deshabilitamos los campos de entrada para evitar errores
        campoA.setEnabled(false);
        campoB.setEnabled(false);

        // Configuración inicial del comportamiento del grupo de botones de radio
        configurarGrupoOpciones();

        // Deshabilitamos el campo de salida (campoC) para que no sea editable
        campoC.setEnabled(false);

        // Configuración del botón "Calcular"
        botonCalcular.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                calcularResultado(); // Llama al método para calcular el resultado
            }
        });

        // Configuración del botón "Borrar"
        botonBorrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                borrarEntradas(); // Llama al método para limpiar los campos
            }
        });

        botonRegresar.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                Intent intent = new Intent(MainActivity2.this, MainActivity.class);
                startActivity(intent);
            }
        });

        // Configuración del cambio de fondo en los EditText al enfocarlos
        configurarCambiosFoco();
    }

    // Configuración del grupo de radio botones
    private void configurarGrupoOpciones() {
        opcionGrupo.setOnCheckedChangeListener(new RadioGroup.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(RadioGroup group, int checkedId) {
                // Verifica qué opción fue seleccionada y ajusta el modo de operación
                modoUnBit = (checkedId == R.id.unbit);
                configurarModo(); // Configura el modo según la selección
                habilitarEntradas();  // Habilita los campos de entrada
            }
        });
    }

    // Método para habilitar los campos de entrada
    private void habilitarEntradas() {
        campoA.setEnabled(true); // Habilita el campo A
        campoB.setEnabled(true); // Habilita el campo B
    }

    // Configura las restricciones del modo (1 bit o 8 bits)
    private void configurarModo() {
        if (modoUnBit) {
            // Modo de 1 bit: permite solo un carácter en los campos de entrada
            campoA.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(1)});
            campoB.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(1)});
        } else {
            // Modo de 8 bits: permite hasta 8 caracteres en los campos de entrada
            campoA.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(8)});
            campoB.setFilters(new android.text.InputFilter[]{new android.text.InputFilter.LengthFilter(8)});
        }
        borrarEntradas(); // Limpia los campos después de cambiar el modo
    }

    // Método para calcular el resultado
    private void calcularResultado() {
        // Obtiene los valores de entrada, eliminando espacios en blanco
        String valorA = campoA.getText().toString().trim();
        String valorB = campoB.getText().toString().trim();

        // Verifica si los campos están vacíos
        if (valorA.isEmpty() || valorB.isEmpty()) {
            Toast.makeText(this, "Por favor ingresa los valores A y B", Toast.LENGTH_SHORT).show();
            MediaPlayer sonidoError = MediaPlayer.create(this, R.raw.nok); // Reproduce un sonido de error
            sonidoError.start();
            return;
        }

        // Valida que las entradas contengan solo los valores permitidos (0 o 1)
        if (!validarEntrada(valorA) || !validarEntrada(valorB)) {
            Toast.makeText(this, "Solo se permiten valores 0 o 1", Toast.LENGTH_SHORT).show();
            MediaPlayer sonidoError = MediaPlayer.create(this, R.raw.nok); // Reproduce un sonido de error
            sonidoError.start();
            return;
        }

        // Si el modo es de 8 bits, ajusta los valores a 8 caracteres
        if (!modoUnBit) {
            if (valorA.length() < 8) {
                valorA = String.format("%-8s", valorA).replace(' ', '0'); // Completa con ceros
                campoA.setText(valorA); // Actualiza el campo A
            }
            if (valorB.length() < 8) {
                valorB = String.format("%-8s", valorB).replace(' ', '0'); // Completa con ceros
                campoB.setText(valorB); // Actualiza el campo B
            }
        }

        // Realiza la operación lógica AND según el modo seleccionado
        if (modoUnBit) {
            // Operación de 1 bit
            int bitA = Integer.parseInt(valorA);
            int bitB = Integer.parseInt(valorB);
            int resultado = bitA & bitB; // AND lógico
            campoC.setText(String.valueOf(resultado)); // Muestra el resultado
            MediaPlayer sonidoExito = MediaPlayer.create(this, R.raw.ok); // Reproduce un sonido de éxito
            sonidoExito.start();
        } else {
            // Operación de 8 bits
            StringBuilder resultado = new StringBuilder();
            for (int i = 0; i < 8; i++) {
                int bitA = Character.getNumericValue(valorA.charAt(i));
                int bitB = Character.getNumericValue(valorB.charAt(i));
                resultado.append(bitA & bitB); // Calcula el AND de cada par de bits
            }
            campoC.setText(resultado.toString()); // Muestra el resultado
            MediaPlayer sonidoExito = MediaPlayer.create(this, R.raw.ok); // Reproduce un sonido de éxito
            sonidoExito.start();
        }
    }

    // Metodo para borrar los valores de los campos
    private void borrarEntradas() {
        campoA.setText(""); // Limpia el campo A
        campoB.setText(""); // Limpia el campo B
        campoC.setText(""); // Limpia el campo de salida
    }

    // Valida que la entrada contenga solo 0 o 1
    private boolean validarEntrada(String entrada) {
        return entrada.matches("[01]+"); // Verifica que la entrada sea una secuencia de 0 y 1
    }

    // Metodo para configurar los listeners de cambio de foco
    private void configurarCambiosFoco() {
        View.OnFocusChangeListener listenerCambioFoco = new View.OnFocusChangeListener() {
            @Override
            public void onFocusChange(View v, boolean hasFocus) {
                if (hasFocus) {
                    v.setBackgroundResource(R.drawable.bordesactivos); // Cambia el fondo al personalizado
                } else {
                    v.setBackgroundResource(R.drawable.rectanguloazul); // Restaura el fondo predeterminado
                }
            }
        };

        campoA.setOnFocusChangeListener(listenerCambioFoco);
        campoB.setOnFocusChangeListener(listenerCambioFoco);
    }
}
