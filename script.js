document.addEventListener('DOMContentLoaded', function() {
    
    const btn = document.getElementById('calc-btn');
    const inputFc = document.getElementById('fc');
    const inputC1 = document.getElementById('c1');
    const stepsContainer = document.getElementById('steps-container');

    btn.addEventListener('click', function() {
        
        // 1. Get Values
        const fc = parseFloat(inputFc.value);
        const c1 = parseFloat(inputC1.value);

        // Validation
        if (isNaN(fc) || fc <= 0) {
            stepsContainer.innerHTML = "<p class='error'>Please enter a valid Frequency!</p>";
            return;
        }

        // --- MATH LOGIC ---
        // Sallen-Key Unity Gain Low-Pass
        
        // Step A: Calculate C2 based on Butterworth Q (0.707)
        // For Unity Gain, we need C1 >= 2*C2. We pick C2 = C1 / 2.
        const c2 = c1 / 2;

        // Step B: Calculate Resistor R
        // Formula: R = 1 / (2 * pi * fc * sqrt(C1 * C2))
        const pi = Math.PI;
        const rootC = Math.sqrt(c1 * c2);
        const r_val = 1 / (2 * pi * fc * rootC);

        // --- FORMATTING HELPERS ---
        // Helper to make "100e-9" look like "100 nF"
        const formatCap = (val) => {
            if (val < 1e-6) return (val * 1e9).toFixed(1) + " nF";
            return (val * 1e6).toFixed(2) + " µF";
        };

        const formatRes = (val) => {
            if (val >= 1000) return (val / 1000).toFixed(3) + " kΩ";
            return val.toFixed(2) + " Ω";
        };

        // --- GENERATE THE STEP-BY-STEP HTML ---
        
        let html = `
            <div class="step-box">
                <div class="step-title">1. Define Parameters</div>
                <div class="step-desc">
                    We start with the user-defined constraints: <br>
                    <strong>Target Cutoff ($f_c$):</strong> ${fc} Hz <br>
                    <strong>Chosen Capacitor ($C_1$):</strong> ${formatCap(c1)}
                </div>
            </div>

            <div class="step-box">
                <div class="step-title">2. Calculate $C_2$ (Butterworth Criteria)</div>
                <div class="step-desc">
                    For a maximally flat <strong>Butterworth</strong> response ($Q = 0.707$) in a Unity-Gain Sallen-Key topology, the ratio between capacitors must satisfy the damping requirement. <br>
                    The standard simplification is:
                    <div class="formula">$$C_2 = \\frac{C_1}{2}$$</div>
                    Substitution:
                    <div class="calc-sub">$$C_2 = \\frac{${formatCap(c1)}}{2} = ${formatCap(c2)}$$</div>
                </div>
            </div>

            <div class="step-box">
                <div class="step-title">3. Calculate Resistors ($R$)</div>
                <div class="step-desc">
                    In this topology, we set $R_1 = R_2 = R$. We solve for $R$ using the characteristic frequency equation:
                    <div class="formula">$$R = \\frac{1}{2 \\cdot \\pi \\cdot f_c \\cdot \\sqrt{C_1 \\cdot C_2}}$$</div>
                    
                    First, find the geometric mean of capacitors:
                    <div class="calc-sub">$$\\sqrt{C_1 C_2} = \\sqrt{${formatCap(c1)} \\cdot ${formatCap(c2)}} \\approx ${(rootC).toExponential(2)}$$</div>
                    
                    Finally, solve for R:
                    <div class="calc-sub">$$R = \\frac{1}{2 \\cdot \\pi \\cdot ${fc} \\cdot ${(rootC).toExponential(2)}}$$</div>
                </div>
            </div>

            <div class="step-box final-result">
                <div class="step-title">4. Final Component Values</div>
                <div class="step-desc">
                    To build this filter, use these values:
                    <ul style="margin-top:10px; list-style:none; padding:0;">
                        <li><strong>$R_1 = R_2$:</strong> <span class="highlight">${formatRes(r_val)}</span></li>
                        <li><strong>$C_1$:</strong> <span class="highlight">${formatCap(c1)}</span></li>
                        <li><strong>$C_2$:</strong> <span class="highlight">${formatCap(c2)}</span></li>
                    </ul>
                </div>
            </div>
        `;

        stepsContainer.innerHTML = html;
        
    });
});