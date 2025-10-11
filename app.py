import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Conexión a Neon PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = (
    'postgresql://neondb_owner:npg_2cVUAdL6KimI@'
    'ep-dry-voice-adt1xfvm-pooler.c-2.us-east-1.aws.neon.tech/'
    'neondb?sslmode=require&channel_binding=require'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)

@app.route('/')
def index():
    return '<h2>App desplegada correctamente 🚀</h2><p>Usa /api/users</p>'

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    new_user = User(username=data['username'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'id': new_user.id, 'username': new_user.username}), 201

@app.route('/api/users')
def get_users():
    users = User.query.all()
    return jsonify([{'id': u.id, 'username': u.username} for u in users])

if __name__ == "__main__":
    # Crear tablas si no existen
    with app.app_context():
        db.create_all()
    app.run(debug=True)
