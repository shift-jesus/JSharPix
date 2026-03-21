import os
import uuid
from flask import Blueprint, request, jsonify, send_from_directory, abort
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from models import db, Photo, User, Friendship
from config import Config

photos = Blueprint('photos', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.',1)[1].lower() in Config.ALLOWED_EXTENSIONS

def get_user_folder(user_id):
    folder = os.path.join(Config.UPLOAD_FOLDER, str(user_id))
    os.makedirs(folder, exist_ok=True)
    return folder

def is_friend(owner_id):
    return Friendship.query.filter_by(
        user_id=owner_id, friend_id=current_user.id
    ).first() is not None

@photos.route('', methods=['GET'])
@login_required
def get_photos():
    user_photos = Photo.query.filter_by(user_id=current_user.id).order_by(Photo.uploaded_at.desc()).all()
    return jsonify([p.to_dict() for p in user_photos]), 200

@photos.route('/<int:photo_id>', methods=['GET'])
@login_required
def get_photo(photo_id):
    photo = Photo.query.get_or_404(photo_id)
    if photo.user_id != current_user.id:
        abort(403)
    return jsonify(photo.to_dict()), 200

@photos.route('/upload', methods=['POST'])
@login_required
def upload():
    if 'photos' not in request.files:
        return jsonify({'message':'No se enviaron archivos'}), 400
    files       = request.files.getlist('photos')
    title       = request.form.get('title','').strip()
    description = request.form.get('description','').strip()
    is_public   = request.form.get('is_public','false').lower() == 'true'
    uploaded    = []
    for file in files:
        if file and allowed_file(file.filename):
            original_name = secure_filename(file.filename)
            ext           = original_name.rsplit('.',1)[1].lower()
            unique_name   = f"{uuid.uuid4().hex}.{ext}"
            folder        = get_user_folder(current_user.id)
            file.save(os.path.join(folder, unique_name))
            photo = Photo(
                filename=unique_name, original_name=original_name,
                title=title or original_name, description=description,
                is_public=is_public,
                file_size=os.path.getsize(os.path.join(folder, unique_name)),
                user_id=current_user.id
            )
            db.session.add(photo)
            uploaded.append(unique_name)
    if not uploaded:
        return jsonify({'message':'Formato no permitido'}), 400
    db.session.commit()
    return jsonify({'message':f'{len(uploaded)} foto(s) subida(s)'}), 201

@photos.route('/<int:photo_id>', methods=['DELETE'])
@login_required
def delete_photo(photo_id):
    photo = Photo.query.get_or_404(photo_id)
    if photo.user_id != current_user.id:
        abort(403)
    filepath = os.path.join(get_user_folder(current_user.id), photo.filename)
    if os.path.exists(filepath):
        os.remove(filepath)
    db.session.delete(photo)
    db.session.commit()
    return jsonify({'message':'Foto eliminada'}), 200

@photos.route('/<int:photo_id>/toggle-public', methods=['PUT'])
@login_required
def toggle_public(photo_id):
    photo = Photo.query.get_or_404(photo_id)
    if photo.user_id != current_user.id:
        abort(403)
    photo.is_public = not photo.is_public
    db.session.commit()
    return jsonify({'message':'Actualizado', 'is_public': photo.is_public}), 200

@photos.route('/file/<filename>', methods=['GET'])
@login_required
def serve_file(filename):
    folder = get_user_folder(current_user.id)
    return send_from_directory(folder, filename)

@photos.route('/friend/<int:user_id>/<filename>', methods=['GET'])
@login_required
def serve_friend_file(user_id, filename):
    if not is_friend(user_id) and user_id != current_user.id:
        abort(403)
    folder = get_user_folder(user_id)
    return send_from_directory(folder, filename)

@photos.route('/avatar', methods=['POST'])
@login_required
def upload_avatar():
    if 'avatar' not in request.files:
        return jsonify({'message':'No se envió archivo'}), 400
    file = request.files['avatar']
    if not allowed_file(file.filename):
        return jsonify({'message':'Formato no permitido'}), 400
    ext         = secure_filename(file.filename).rsplit('.',1)[1].lower()
    unique_name = f"avatar_{uuid.uuid4().hex}.{ext}"
    folder      = get_user_folder(current_user.id)
    file.save(os.path.join(folder, unique_name))
    current_user.avatar = unique_name
    db.session.commit()
    return jsonify({'message':'Avatar actualizado', 'avatar': unique_name}), 200

@photos.route('/banner', methods=['POST'])
@login_required
def upload_banner():
    if 'banner' not in request.files:
        return jsonify({'message':'No se envió archivo'}), 400
    file = request.files['banner']
    if not allowed_file(file.filename):
        return jsonify({'message':'Formato no permitido'}), 400
    ext         = secure_filename(file.filename).rsplit('.',1)[1].lower()
    unique_name = f"banner_{uuid.uuid4().hex}.{ext}"
    folder      = get_user_folder(current_user.id)
    file.save(os.path.join(folder, unique_name))
    current_user.banner = unique_name
    db.session.commit()
    return jsonify({'message':'Banner actualizado', 'banner': unique_name}), 200

@photos.route('/friends/connect', methods=['POST'])
@login_required
def connect_friend():
    data = request.get_json()
    code = data.get('code','').strip().upper()
    if not code:
        return jsonify({'message':'Código requerido'}), 400
    target = User.query.filter_by(friend_code=code).first()
    if not target:
        return jsonify({'message':'Código inválido — usuario no encontrado'}), 404
    if target.id == current_user.id:
        return jsonify({'message':'No puedes conectarte contigo mismo'}), 400
    existing = Friendship.query.filter_by(user_id=target.id, friend_id=current_user.id).first()
    if existing:
        return jsonify({'message':'Ya tienes acceso a esta galería'}), 400
    friendship = Friendship(user_id=target.id, friend_id=current_user.id)
    db.session.add(friendship)
    db.session.commit()
    return jsonify({'message':f'¡Conectado con {target.alias or target.username}!', 'user': target.to_dict()}), 200

@photos.route('/friends/list', methods=['GET'])
@login_required
def list_friends():
    friendships = Friendship.query.filter_by(friend_id=current_user.id).all()
    result = []
    for f in friendships:
        user = User.query.get(f.user_id)
        if user:
            public_photos = Photo.query.filter_by(user_id=user.id, is_public=True).count()
            result.append({ **user.to_dict(), 'public_photos': public_photos })
    return jsonify(result), 200

@photos.route('/friends/<int:user_id>/gallery', methods=['GET'])
@login_required
def friend_gallery(user_id):
    if not is_friend(user_id):
        abort(403)
    user   = User.query.get_or_404(user_id)
    photos = Photo.query.filter_by(user_id=user_id, is_public=True).order_by(Photo.uploaded_at.desc()).all()
    return jsonify({'user': user.to_dict(), 'photos': [p.to_dict() for p in photos]}), 200