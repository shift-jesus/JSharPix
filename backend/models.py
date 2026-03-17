from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id            = db.Column(db.Integer, primary_key=True)
    username      = db.Column(db.String(80), unique=True, nullable=False)
    email         = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    created_at    = db.Column(db.DateTime, default=datetime.utcnow)

    # Perfil
    alias         = db.Column(db.String(100))
    bio           = db.Column(db.Text)
    avatar        = db.Column(db.String(256))
    banner        = db.Column(db.String(256))
    location      = db.Column(db.String(100))
    website       = db.Column(db.String(200))

    # Equipo fotográfico
    gear_camera   = db.Column(db.String(100))
    gear_film     = db.Column(db.String(100))
    gear_lens     = db.Column(db.String(100))
    gear_location = db.Column(db.String(100))

    # Layout preferido
    layout        = db.Column(db.String(20), default='masonry')

    photos = db.relationship('Photo', backref='owner', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id':            self.id,
            'username':      self.username,
            'email':         self.email,
            'alias':         self.alias,
            'bio':           self.bio,
            'avatar':        self.avatar,
            'banner':        self.banner,
            'location':      self.location,
            'website':       self.website,
            'gear_camera':   self.gear_camera,
            'gear_film':     self.gear_film,
            'gear_lens':     self.gear_lens,
            'gear_location': self.gear_location,
            'layout':        self.layout,
            'created_at':    self.created_at.isoformat(),
            'photo_count':   len(self.photos),
        }

class Photo(db.Model):
    __tablename__ = 'photos'
    id            = db.Column(db.Integer, primary_key=True)
    filename      = db.Column(db.String(256), nullable=False)
    original_name = db.Column(db.String(256), nullable=False)
    title         = db.Column(db.String(200))
    description   = db.Column(db.Text)
    file_size     = db.Column(db.Integer)
    uploaded_at   = db.Column(db.DateTime, default=datetime.utcnow)
    user_id       = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def to_dict(self):
        return {
            'id':            self.id,
            'filename':      self.filename,
            'original_name': self.original_name,
            'title':         self.title,
            'description':   self.description,
            'file_size':     self.file_size,
            'uploaded_at':   self.uploaded_at.isoformat(),
            'user_id':       self.user_id,
        }