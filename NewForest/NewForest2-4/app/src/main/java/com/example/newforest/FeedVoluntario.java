package com.example.newforest;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class FeedVoluntario extends AppCompatActivity {

    private ImageButton menuHamburguesa;
    private ImageButton iconoPerfil;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.feed_voluntario);

        // Iniciar elementos de la interfaz
        menuHamburguesa = findViewById(R.id.menu_hamburguesa);
        iconoPerfil = findViewById(R.id.icono_perfil);

        // Acción de menú hamburguesa
        menuHamburguesa.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Aquí se puede abrir un menú lateral o navegar a una nueva actividad
                // Ejemplo:
                // startActivity(new Intent(FeedVoluntario.this, MenuActivity.class));
            }
        });

        // Acción de icono de perfil
        iconoPerfil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Navegar a la actividad de perfil
                Intent intent = new Intent(FeedVoluntario.this, FeedVoluntario.class);
                startActivity(intent);
            }
        });


    }

}
