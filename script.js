document.addEventListener('DOMContentLoaded', function() {
    
    // --- CONFIGURATION ---
    const btn = document.getElementById('calc-btn');
    
    // Inputs
    const inputFc = document.getElementById('fc');
    const inputC1 = document.getElementById('c1');
    
    // Outputs
    const outResistor = document.getElementById('resistor-val');
    const outCap2 = document.getElementById('capacitor2-val');

    // --- CALCULATION EVENT ---
    btn.addEventListener('click', function() {
        
        // 1. Get User Inputs
        const fc = parseFloat(inputFc.value);      // Frequency in Hz
        const c1 = parseFloat(inputC1.value);      // C1 in Farads

        // Validation
        if (isNaN(fc) || fc <= 0) {
            alert("Please enter a valid Cutoff Frequency (Hz).");
            return;
        }

        // 2. THE MATH: Sallen-Key Unity Gain Low-Pass (Op-Amp)
        // ----------------------------------------------------
        // For a Second-Order Butterworth Response (Q = 0.707):
        // We use the "Unity Gain" topology (Op-Amp as a buffer).
        // The damping is controlled by the ratio of capacitors.
        //
        // Logic:
        // 1. We fix C1 (User choice).
        // 2. To satisfy Q=0.707, Physics dictates: C1 must be >= 2*C2.
        //    So we set C2 = C1 / 2.
        // 3. We assume Equal Resistors (R1 = R2 = R).
        // 4. We solve for R using the cutoff frequency formula:
        //    fc = 1 / (2 * pi * R * sqrt(C1 * C2))
        
        const c2 = c1 / 2;
        
        const pi = Math.PI;
        // Calculate the square root of the product of capacitors
        const geometricMeanC = Math.sqrt(c1 * c2);
        
        // Calculate Resistor Value
        const r_val = 1 / (2 * pi * fc * geometricMeanC);

        // 3. FORMATTING (Engineering Notation)
        
        // Format Resistor (Ohms vs kOhms)
        let r_display = "";
        if (r_val >= 1000) {
            r_display = (r_val / 1000).toFixed(2) + " kΩ";
        } else {
            r_display = r_val.toFixed(1) + " Ω";
        }

        // Format Capacitor C2 (nF vs uF)
        let c2_display = "";
        if (c2 < 1e-6) {
            // Display in nanoFarads (nF)
            c2_display = (c2 * 1e9).toFixed(1) + " nF";
        } else {
            // Display in microFarads (uF)
            c2_display = (c2 * 1e6).toFixed(2) + " µF";
        }

        // 4. UPDATE DISPLAY
        outResistor.innerText = r_display;
        outCap2.innerText = c2_display;
        
    });

});