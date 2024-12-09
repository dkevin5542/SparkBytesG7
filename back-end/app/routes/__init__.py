from flask import Flask

def register_routes(app: Flask):
    from .user_routes import user_bp
    from .event_routes import event_bp
    from .auth_routes import auth_bp
    from .rsvp_routes import rsvp_bp
    from .favorite_routes import fav_bp
    from .review_routes import review_bp

    app.register_blueprint(user_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(rsvp_bp)
    app.register_blueprint(fav_bp)
    app.register_blueprint(review_bp)

