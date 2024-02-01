import psycopg2

from user import User


def execute_database_command(command):
    conn = psycopg2.connect(
        dbname='sechat',
        user='postgres',
        password='y0gcypM9JrzjPXasUn',
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
    rows = execute_database_command(f"select * from users where mail = '{mail}' and password = '{password}'")
    if len(rows) <= 0:
        return None
    user_row = rows[0]
    return User(user_row[0], user_row[1], user_row[2], user_row[3], user_row[4])
