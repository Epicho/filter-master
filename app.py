from flask import Flask, render_template, request

app = Flask(__name__)

# --- ROUTE 1: The Home Page ---
@app.route('/')
def index():
    # This looks for 'index.html' inside the 'templates' folder
    return render_template('index.html')

# --- ROUTE 2: The Calculation (Triggered by the button) ---
@app.route('/calculate', methods=['POST'])
def calculate():
    # 1. Get data from the form
    try:
        fc = float(request.form['fc'])
        gain = float(request.form['gain'])
        c1_val = float(request.form['c1'])
        approx_type = request.form['approx']
        
        # 2. Placeholder for Calculation Logic (We will add this next!)
        print(f"Designing a {approx_type} filter at {fc}Hz with Gain {gain}")
        
        # For now, just reload the page so it doesn't crash
        return render_template('index.html')
        
    except ValueError:
        return "Error: Please enter valid numbers."

if __name__ == '__main__':
    app.run(debug=True)