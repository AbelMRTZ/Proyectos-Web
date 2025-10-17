package com.example.newforest;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Button buttonComenzar = findViewById(R.id.comenzar);
        Button buttonIniciarSesion = findViewById(R.id.iniciarsesion);

        buttonComenzar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Cuando el botón Comenzar se presiona, se abre la actividad de registro
                Intent intent = new Intent(MainActivity.this, RegistroOrganizadorActivity.class);
                startActivity(intent);
            }
        });

        buttonIniciarSesion.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Cuando el botón Comenzar se presiona, se abre la actividad de registro
                Intent intent = new Intent(MainActivity.this, IniciarSesion.class);
                startActivity(intent);
            }
        });
    }
}
