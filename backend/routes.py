import os
import uuid
from flask import Blueprint, request, jsonify, send_from_directory, abort
from flask_login import login_required, current_user
from werkzeug.utils import secure_filename
from models import db, Photo
from config import Config

photos = Blueprint('photos', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in Config.ALLOWED_EXTENSIONS

def get_user_folder(user_id):
    folder = os.path.join(Config.UPLOAD_FOLDER, str(user_id))
    os.makedirs(folder, exist_ok=True)
    return folder

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
        return jsonify({'message': 'No se enviaron archivos'}), 400
    files = request.files.getlist('photos')
    title = request.form.get('title', '').strip()
    description = request.form.get('description', '').strip()
    uploaded = []
    for file in files:
        if file and allowed_file(file.filename):
            original_name = secure_filename(file.filename)
            ext = original_name.rsplit('.', 1)[1].lower()
            unique_name = f"{uuid.uuid4().hex}.{ext}"
            folder = get_user_folder(current_user.id)
            file.save(os.path.join(folder, unique_name))
            photo = Photo(
                filename=unique_name,
                original_name=original_name,
                title=title or original_name,
                description=description,
                file_size=os.path.getsize(os.path.join(folder, unique_name)),
                user_id=current_user.id
            )
            db.session.add(photo)
            uploaded.append(unique_name)
    if not uploaded:
        return jsonify({'message': 'Formato no permitido'}), 400
    db.session.commit()
    return jsonify({'message': f'{len(uploaded)} foto(s) subida(s)'}), 201

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
    return jsonify({'message': 'Foto eliminada'}), 200

@photos.route('/file/<filename>', methods=['GET'])
@login_required
def serve_file(filename):
    folder = get_user_folder(current_user.id)
    return send_from_directory(folder, filename)