document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Select the button and inputs
    const btn = document.getElementById('calc-btn');
    const inputFc = document.getElementById('fc');
    const inputC1 = document.getElementById('c1');
    
    // 2. Select the output text areas
    const outResistor = document.getElementById('resistor-val');
    const outCap2 = document.getElementById('capacitor2-val');

    // 3. Listen for the click
    btn.addEventListener('click', function() {
        
        // --- STEP A: GET VALUES ---
        const fc = parseFloat(inputFc.value); // e.g., 1000
        const c1 = parseFloat(inputC1.value); // e.g., 0.0000001 (100nF)

        // Simple validation
        if (isNaN(fc) || fc <= 0) {
            alert("Please enter a valid frequency!");
            return;
        }

        // --- STEP B: THE PHYSICS (Sallen-Key Unity Gain Low Pass) ---
        // For a Butterworth Filter (Max Flat), Q must be 0.707.
        // The standard "Equal Resistor" simplification uses this ratio:
        // C1 = 2 * C2
        // R1 = R2 = R
        
        const c2 = c1 / 2;
        
        // R = 1 / (2 * pi * fc * sqrt(C1 * C2))
        const pi = Math.PI;
        const rootCs = Math.sqrt(c1 * c2);
        const r_val = 1 / (2 * pi * fc * rootCs);

        // --- STEP C: FORMATTING ---
        // Convert to readable units (Ohms vs kOhms)
        let r_display = "";
        if (r_val >= 1000) {
            r_display = (r_val / 1000).toFixed(2) + " kΩ";
        } else {
            r_display = r_val.toFixed(1) + " Ω";
        }

        // Convert C2 to nF or uF
        let c2_display = "";
        if (c2 < 1e-6) {
            c2_display = (c2 * 1e9).toFixed(1) + " nF";
        } else {
            c2_display = (c2 * 1e6).toFixed(1) + " uF";
        }

        // --- STEP D: UPDATE SCREEN ---
        outResistor.innerText = r_display;
        outCap2.innerText = c2_display;
        
    });

});