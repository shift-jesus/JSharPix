from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime, timedelta
import secrets
import string

db = SQLAlchemy()

def generate_friend_code():
    chars = string.ascii_uppercase + string.digits
    code = ''.join(secrets.choice(chars) for _ in range(8))
    return 'JSP-' + code[:4] + '-' + code[4:]

def generate_share_token():
    return secrets.token_urlsafe(6).upper()[:8]

class Friendship(db.Model):
    __tablename__ = 'friendships'
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    friend_id  = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id                 = db.Column(db.Integer, primary_key=True)
    username           = db.Column(db.String(80), unique=True, nullable=False)
    email              = db.Column(db.String(120), unique=True, nullable=False)
    password_hash      = db.Column(db.String(256), nullable=False)
    created_at         = db.Column(db.DateTime, default=datetime.utcnow)
    friend_code        = db.Column(db.String(20), unique=True)
    share_token        = db.Column(db.String(20))
    share_token_expires= db.Column(db.DateTime)
    alias              = db.Column(db.String(100))
    bio                = db.Column(db.Text)
    avatar             = db.Column(db.String(256))
    banner             = db.Column(db.String(256))
    location           = db.Column(db.String(100))
    website            = db.Column(db.String(200))
    gear_location      = db.Column(db.String(100))
    layout             = db.Column(db.String(20), default='masonry')
    photos             = db.relationship('Photo', backref='owner', lazy=True, cascade='all, delete-orphan')

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.friend_code:
            self.friend_code = generate_friend_code()
        self.refresh_share_token()

    def refresh_share_token(self):
        self.share_token = generate_share_token()
        self.share_token_expires = datetime.utcnow() + timedelta(minutes=30)

    def get_share_token(self):
        if not self.share_token or not self.share_token_expires or datetime.utcnow() > self.share_token_expires:
            self.refresh_share_token()
            db.session.commit()
        return self.share_token

    def to_dict(self):
        return {
            'id':           self.id,
            'username':     self.username,
            'email':        self.email,
            'alias':        self.alias,
            'bio':          self.bio,
            'avatar':       self.avatar,
            'banner':       self.banner,
            'location':     self.location,
            'website':      self.website,
            'gear_location':self.gear_location,
            'layout':       self.layout,
            'friend_code':  self.friend_code,
            'share_token':  self.get_share_token(),
            'created_at':   self.created_at.isoformat(),
            'photo_count':  len(self.photos),
        }

class Photo(db.Model):
    __tablename__ = 'photos'
    id            = db.Column(db.Integer, primary_key=True)
    filename      = db.Column(db.String(256), nullable=False)
    original_name = db.Column(db.String(256), nullable=False)
    title         = db.Column(db.String(200))
    description   = db.Column(db.Text)
    file_size     = db.Column(db.Integer)
    is_public     = db.Column(db.Boolean, default=False)
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
            'is_public':     self.is_public,
            'uploaded_at':   self.uploaded_at.isoformat(),
            'user_id':       self.user_id,
        }