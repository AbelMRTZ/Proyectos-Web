package com.example.newforest;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class IniciarSesion extends AppCompatActivity {

    private EditText editTextEmail, editTextPassword;
    private Button buttonLogin, buttonRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.iniciar_sesion);

        // Enlazar vistas
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
        buttonLogin = findViewById(R.id.buttonLogin);
        buttonRegister = findViewById(R.id.buttonRegister);

        // Acción del botón de iniciar sesión
        buttonLogin.setOnClickListener(v -> {
            String email = editTextEmail.getText().toString().trim();
            String password = editTextPassword.getText().toString().trim();

            // Validar campos vacíos
            if (email.isEmpty() || password.isEmpty()) {
                Toast.makeText(IniciarSesion.this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show();
                return;
            }

            // Verificar credenciales (lógica de ejemplo)
            if (email.equals("admin@newforest.com") && password.equals("123456")) {
                Toast.makeText(IniciarSesion.this, "Inicio de sesión exitoso", Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(IniciarSesion.this, FeedVoluntario.class);
                startActivity(intent);
            } else {
                Toast.makeText(IniciarSesion.this, "Correo o contraseña incorrectos", Toast.LENGTH_SHORT).show();
            }
        });

        // Acción del botón de registro
        buttonRegister.setOnClickListener(v -> {
            Intent intent = new Intent(IniciarSesion.this, RegistroOrganizadorActivity.class);
            startActivity(intent);
        });



    }
}
