import string
import random
import database

tokens = {}


def generate_token():
    chars = string.ascii_letters + string.digits
    return ''.join(random.choice(chars) for _ in range(40))


def login_user(user):
    token = generate_token()
    database.add_login(token, user.user_id)
    return token

def logout_user(token):
    database.remove_login(token)


def get_user_by_token(token):
    user_id = database.get_login_user_id_for_token(token)
    if user_id == None:
        return None
    user = database.get_user_by_id(user_id)
    return user
