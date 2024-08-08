from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/invocar')
def invocar():
    print("Hecho en Python")
    return "Hecho en Python"

if __name__ == '__main__':
    app.run(debug=True)
