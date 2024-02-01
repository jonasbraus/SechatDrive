import string
import random

tokens = {}


def generate_token():
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(40))


def login_user(user):
    token = generate_token()
    tokens[token] = user
    return token


def get_user_by_token(token):
    if not token in tokens:
        return None
    return tokens[token]
