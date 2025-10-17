package com.example.newforest;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import androidx.appcompat.app.AppCompatActivity;

public class RegistroVoluntarioActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.pantalla_registro_voluntario);

        Button buttonOrganizer = findViewById(R.id.button_organizer);
        Button buttonVolunteer = findViewById(R.id.button_volunteer);
        Button buttonBack = findViewById(R.id.buttonBack);
        Button buttonLogin = findViewById(R.id.buttonLogin);

        // Cambiar a la pantalla de registro de organizador
        buttonOrganizer.setOnClickListener(view -> {
            Intent intent = new Intent(RegistroVoluntarioActivity.this, RegistroOrganizadorActivity.class);
            startActivity(intent);
            overridePendingTransition(0, 0);
            finish();
        });

        buttonBack.setOnClickListener(view -> {
            Intent intent = new Intent(RegistroVoluntarioActivity.this, MainActivity.class);
            startActivity(intent);
            finish();
        });

        buttonLogin.setOnClickListener(view -> {
            Intent intent = new Intent(RegistroVoluntarioActivity.this, IniciarSesion.class);
            startActivity(intent);
            finish();
        });

        // El botón de voluntario ya está activo, sin acción necesaria
        buttonVolunteer.setOnClickListener(view -> {
            // Mantener la pantalla actual
        });
    }
}
