document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SELECT ELEMENTS ---
    const btn = document.getElementById('calc-btn');
    const inputFc = document.getElementById('fc');
    const inputC1 = document.getElementById('c1');
    const stepsContainer = document.getElementById('steps-container');

    // --- 2. DEFINE HELPER FUNCTIONS ---
    
    // Helper: Format Capacitance (e.g. 100e-9 -> 100 nF)
    const formatCap = (val) => {
        if (val < 1e-6) return (val * 1e9).toFixed(1) + " nF";
        return (val * 1e6).toFixed(2) + " µF";
    };

    // Helper: Format Resistance (e.g. 1500 -> 1.5 kΩ)
    const formatRes = (val) => {
        if (val >= 1000) return (val / 1000).toFixed(3) + " kΩ";
        return val.toFixed(2) + " Ω";
    };

    // --- 3. MAIN CALCULATION EVENT ---
    btn.addEventListener('click', function() {
        
        // A. Get User Values
        const fc = parseFloat(inputFc.value);
        const c1 = parseFloat(inputC1.value);

        // B. Validation
        if (isNaN(fc) || fc <= 0) {
            stepsContainer.innerHTML = "<p class='error'>Please enter a valid Cutoff Frequency (Hz)!</p>";
            return;
        }

        // --- C. THE MATH LOGIC ---
        // Sallen-Key Unity Gain Low-Pass (Butterworth Response)
        
        // Step 1: Capacitor Ratio for Q = 0.707
        // For a Unity Gain Sallen-Key to be Butterworth, C1 must be >= 2*C2.
        // We set C2 = C1 / 2.
        const c2 = c1 / 2;

        // Step 2: Calculate Resistors
        // Formula: R = 1 / (2 * pi * fc * sqrt(C1 * C2))
        const pi = Math.PI;
        const rootC = Math.sqrt(c1 * c2);
        const r_val = 1 / (2 * pi * fc * rootC);

        // --- D. GENERATE EXPLANATION HTML ---
        
        let html = `
            <div class="step-box">
                <div class="step-title">1. Initialize Parameters</div>
                <div class="step-desc">
                    Target Design Constraints: <br>
                    <strong>Cutoff Frequency ($f_c$):</strong> ${fc} Hz <br>
                    <strong>Selected Capacitor ($C_1$):</strong> ${formatCap(c1)}
                </div>
            </div>

            <div class="step-box">
                <div class="step-title">2. Determine Capacitor Ratio ($C_2$)</div>
                <div class="step-desc">
                    We are designing a <strong>Unity-Gain Sallen-Key</strong> filter with a <strong>Butterworth</strong> response (Maximal Flatness). 
                    To achieve the required Quality Factor ($Q = 0.707$) without using gain resistors, the capacitors must satisfy:
                    <div class="formula">$$C_2 = \\frac{C_1}{2}$$</div>
                    Substituting the value of $C_1$:
                    <div class="calc-sub">$$C_2 = \\frac{${formatCap(c1)}}{2} = ${formatCap(c2)}$$</div>
                </div>
            </div>

            <div class="step-box">
                <div class="step-title">3. Calculate Resistors ($R$)</div>
                <div class="step-desc">
                    In this symmetric topology, we set $R_1 = R_2 = R$. We calculate $R$ using the characteristic frequency equation:
                    <div class="formula">$$R = \\frac{1}{2 \\cdot \\pi \\cdot f_c \\cdot \\sqrt{C_1 \\cdot C_2}}$$</div>
                    
                    First, we find the geometric mean of the capacitors:
                    <div class="calc-sub">$$\\sqrt{C_1 C_2} = \\sqrt{${formatCap(c1)} \\cdot ${formatCap(c2)}} \\approx ${(rootC).toExponential(2)}$$</div>
                    
                    Solving for R:
                    <div class="calc-sub">$$R = \\frac{1}{2 \\cdot \\pi \\cdot ${fc} \\cdot ${(rootC).toExponential(2)}}$$</div>
                </div>
            </div>

            <div class="step-box final-result">
                <div class="step-title">4. Final Component List</div>
                <div class="step-desc">
                    Construct your circuit using these values:
                    <ul style="margin-top:10px; list-style:none; padding:0;">
                        <li><strong>$R_1 = R_2$:</strong> <span class="highlight">${formatRes(r_val)}</span></li>
                        <li><strong>$C_1$:</strong> <span class="highlight">${formatCap(c1)}</span></li>
                        <li><strong>$C_2$:</strong> <span class="highlight">${formatCap(c2)}</span></li>
                    </ul>
                </div>
            </div>
        `;

        // Inject the HTML into the page
        stepsContainer.innerHTML = html;
        
    });
});