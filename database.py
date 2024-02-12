import psycopg2

from user import User


def execute_database_command(command):
    conn = psycopg2.connect(
        dbname='sechat',
        user='postgres',
        password='XHJUtz6723Lop!',
        host='localhost',
        port='5432',
    )
    rows = None
    cursor = conn.cursor()
    cursor.execute(command)
    if "select" in command.lower():
        rows = cursor.fetchall()
    conn.commit()
    cursor.close()
    conn.close()
    return rows


def get_user_by_mail_and_password(mail, password):
    rows = execute_database_command(
        f"select * from users where mail = '{mail}' and password = '{password}'")
    if len(rows) <= 0:
        return None
    user_row = rows[0]
    return User(user_row[0], user_row[1], user_row[2], user_row[3], user_row[4])


def add_share_element(token, element, user_id):
    execute_database_command(
        f"insert into shares (token, element, user_id) values ('{token}', '{element}', {user_id})")


def get_element_by_token(token):
    try:
        rows = execute_database_command(
            f"select * from shares where token = '{token}'")
        return rows[0][2]
    except:
        return None


def get_token_by_element(element):
    try:
        rows = execute_database_command(
            f"select * from shares where element = '{element}'")
        return rows[0][1]
    except:
        return None


def update_share_element(old_element, new_element):
    execute_database_command(
        f"update shares set element = '{new_element}' where element = '{old_element}'")


def get_shares_for_user(user_id):
    rows = execute_database_command(
        f"select * from shares where user_id = {user_id}")
    return rows


def stop_share(element):
    execute_database_command(f"delete from shares where element = '{element}'")


def get_user_by_id(id):
    rows = execute_database_command(
        f"select * from users where user_id = {id}")
    if len(rows) <= 0:
        return None
    row = rows[0]
    return User(row[0], row[1], row[2], row[3], row[4])


def add_login(token, user_id):
    execute_database_command(
        f"insert into logins (token, user_id) values ('{token}', {user_id})")


def remove_login(token):
    execute_database_command(f"delete from logins where token = '{token}'")


def get_login_user_id_for_token(token):
    rows = execute_database_command(
        f"select * from logins where token = '{token}'")
    if len(rows) <= 0:
        return None
    return rows[0][2]
