from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User

auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    if not username or not email or not password:
        return jsonify({'message': 'Todos los campos son obligatorios'}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({'message': 'El usuario ya existe'}), 400
    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'El correo ya está registrado'}), 400
    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password)
    )
    db.session.add(user)
    db.session.commit()
    login_user(user)
    return jsonify({'message': 'Cuenta creada', 'user': {'id': user.id, 'username': user.username, 'email': user.email}}), 201

@auth.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username', '').strip()
    password = data.get('password', '')
    user = User.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Usuario o contraseña incorrectos'}), 401
    login_user(user, remember=True)
    return jsonify({'message': 'Login exitoso', 'user': {'id': user.id, 'username': user.username, 'email': user.email}}), 200

@auth.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Sesión cerrada'}), 200

@auth.route('/me', methods=['GET'])
@login_required
def me():
    return jsonify({'id': current_user.id, 'username': current_user.username, 'email': current_user.email}), 200