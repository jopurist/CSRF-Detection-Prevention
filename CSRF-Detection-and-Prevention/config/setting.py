# settings.py
SESSION_TIMEOUT = 30  # Session expires after 30 minutes
SAMESITE_COOKIE_NAME = "csrf_cookie"
COOKIE_TIMEOUT = 1800  # 30 minutes
SEQUENCE_RULES = {
    'login': ['login', 'home'],
    'home': ['home','login', 'cart'],
    'cart': ['cart','home', 'add_address'],
    'add_address': ['add_address','cart']
}
