from flask import Flask
from routes.user_routes import user_bp
from routes.event_routes import event_bp
from routes.oauth_routes import oauth_bp
from routes.rsvp_routes import rsvp_bp
from routes.favorite_routes import favorite_bp
from routes.review_routes import review_bp
from routes.test_routes import test_bp

def register_routes(app: Flask):
    app.register_blueprint(user_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(oauth_bp)
    app.register_blueprint(rsvp_bp)
    app.register_blueprint(favorite_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(test_bp) 

