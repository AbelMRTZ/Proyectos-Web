package com.example.reforestacion;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.RadioButton;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class Donaciones extends AppCompatActivity {

    private EditText etAmount;
    private Spinner spinnerTreeTypes;
    private RadioGroup radioGroupPayment;
    private ProgressBar progressBarGoal;
    private Button btnDonate, btnHistory;
    private TextView tvBadge;
    private int donationGoal = 10000; // Objetivo de recaudación
    private int currentDonation = 5000; // Donación actual (por ejemplo)

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.pantalla_donaciones); // Cambiado a pantalla_donaciones.xml

        // Inicialización de elementos
        etAmount = findViewById(R.id.et_amount);
        spinnerTreeTypes = findViewById(R.id.spinner_tree_types);
        radioGroupPayment = findViewById(R.id.radio_group_payment);
        progressBarGoal = findViewById(R.id.progress_bar_goal);
        btnDonate = findViewById(R.id.btn_donate);
        btnHistory = findViewById(R.id.btn_donations_history);
        tvBadge = findViewById(R.id.tv_badge_label);

        // Configurar el progreso de la recaudación
        updateProgress();

        // Botón de Donación
        btnDonate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                handleDonation();
            }
        });

        // Botón para ver historial de donaciones
        btnHistory.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showDonationHistory();
            }
        });
    }

    private void handleDonation() {
        String amountStr = etAmount.getText().toString();
        if (amountStr.isEmpty()) {
            Toast.makeText(this, "Por favor ingrese un monto", Toast.LENGTH_SHORT).show();
            return;
        }

        double amount = Double.parseDouble(amountStr);
        int selectedTreeType = spinnerTreeTypes.getSelectedItemPosition(); // Obtiene el árbol seleccionado
        int selectedPaymentMethod = radioGroupPayment.getCheckedRadioButtonId();

        // Procesar pago según el método seleccionado
        RadioButton selectedPayment = findViewById(selectedPaymentMethod);
        String paymentMethod = selectedPayment.getText().toString();

        // Mostrar información
        String message = "Donaste " + amount + " para el árbol " + selectedTreeType
                + ". Método de pago: " + paymentMethod;
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();

        // Actualizar progreso de recaudación
        currentDonation += amount;
        updateProgress();
    }

    private void updateProgress() {
        int progress = (int) ((double) currentDonation / donationGoal * 100);
        progressBarGoal.setProgress(progress);

        // Mostrar insignia según el progreso
        if (currentDonation >= 10000) {
            tvBadge.setText("Insignia: Donante Máximo");
        } else if (currentDonation >= 5000) {
            tvBadge.setText("Insignia: Donante Platino");
        } else if (currentDonation >= 1000) {
            tvBadge.setText("Insignia: Donante Oro");
        } else {
            tvBadge.setText("Insignia: Donante Básico");
        }
    }

    private void showDonationHistory() {
        // Aquí podrías lanzar una nueva actividad que muestre el historial de donaciones
        Toast.makeText(this, "Mostrar historial de donaciones", Toast.LENGTH_SHORT).show();
    }
}

