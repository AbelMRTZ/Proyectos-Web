package com.example.newforest;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class RegistroOrganizadorActivity extends AppCompatActivity {

    private Button buttonOrganizer, buttonVolunteer, buttonBack, buttonLogin;
    private EditText editTextUsername, editTextEmail, editTextPassword, editTextOrganization, editTextPhone;
    private CheckBox acceptPrivacy;
    private Button buttonRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.pantalla_registro_organizador);

        // Enlazar vistas
        buttonBack = findViewById(R.id.buttonBack);
        buttonLogin = findViewById(R.id.buttonLogin);
        buttonOrganizer = findViewById(R.id.button_organizer);
        buttonVolunteer = findViewById(R.id.button_volunteer);
        editTextUsername = findViewById(R.id.editTextUsername);
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPassword = findViewById(R.id.editTextPassword);
        editTextOrganization = findViewById(R.id.editTextOrganization);
        editTextPhone = findViewById(R.id.editTextPhone);
        acceptPrivacy = findViewById(R.id.accept_privacy);
        buttonRegister = findViewById(R.id.buttonRegister);

        // Configurar botón Organizador seleccionado por defecto
        buttonOrganizer.setBackgroundResource(R.drawable.button_selected);
        buttonOrganizer.setTextColor(getResources().getColor(android.R.color.white));
        buttonVolunteer.setTextColor(getResources().getColor(android.R.color.darker_gray));

        buttonBack.setOnClickListener(v -> {
            Intent intent = new Intent(RegistroOrganizadorActivity.this, MainActivity.class);
            startActivity(intent);
            finish(); // Finaliza la actividad actual para que no vuelva al pulsar "Atrás"
        });

        buttonLogin.setOnClickListener(v -> {
            Intent intent = new Intent(RegistroOrganizadorActivity.this, IniciarSesion.class);
            startActivity(intent);
            finish(); // Finaliza la actividad actual para que no vuelva al pulsar "Atrás"
        });

        // Acción del botón Voluntario
        buttonVolunteer.setOnClickListener(v -> {
            Intent intent = new Intent(RegistroOrganizadorActivity.this, RegistroVoluntarioActivity.class);
            startActivity(intent);
            overridePendingTransition(0, 0);
            finish(); // Finaliza la actividad actual para que no vuelva al pulsar "Atrás"
        });

        // Acción del botón de registro
        buttonRegister.setOnClickListener(v -> {
            String username = editTextUsername.getText().toString().trim();
            String email = editTextEmail.getText().toString().trim();
            String password = editTextPassword.getText().toString().trim();
            String organization = editTextOrganization.getText().toString().trim();
            String phone = editTextPhone.getText().toString().trim();

            // Verificar si se aceptan los términos y condiciones
            if (!acceptPrivacy.isChecked()) {
                Toast.makeText(RegistroOrganizadorActivity.this, "Debe aceptar los términos y condiciones", Toast.LENGTH_SHORT).show();
                return;
            }

            // Verificar que los campos obligatorios estén llenos
            if (username.isEmpty() || email.isEmpty() || password.isEmpty() || organization.isEmpty() || phone.isEmpty()) {
                Toast.makeText(RegistroOrganizadorActivity.this, "Por favor, complete todos los campos", Toast.LENGTH_SHORT).show();
                return;
            }

            // Registrar organizador
            registerOrganizer(username, email, password, organization, phone);
        });
    }

    // Método de registro de organizador
    private void registerOrganizer(String username, String email, String password, String organization, String phone) {
        // Lógica para registrar al organizador (por ejemplo, enviar a un servidor o guardar en una base de datos)
        Toast.makeText(this, "Organizador registrado con éxito", Toast.LENGTH_SHORT).show();
    }
}
