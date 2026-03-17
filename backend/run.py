import os
from flask import Flask
from flask_login import LoginManager
from flask_cors import CORS
from models import db, User
from config import Config
from auth import auth
from routes import photos

app = Flask(__name__)
app.config.from_object(Config)
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE']   = False

CORS(app,
     resources={r"/api/*": {"origins": "http://localhost:5173"}},
     supports_credentials=True)

db.init_app(app)

login_manager = LoginManager(app)
login_manager.login_view = 'auth.login'

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

app.register_blueprint(auth,   url_prefix='/api/auth')
app.register_blueprint(photos, url_prefix='/api/photos')

if __name__ == '__main__':
    with app.app_context():
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
        os.makedirs('instance', exist_ok=True)
        db.create_all()
    app.run(debug=True, port=5000)