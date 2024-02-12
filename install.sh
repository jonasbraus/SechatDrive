sudo apt install python3 -y
sudo apt install python3-psycopg2 -y
sudo apt install python3-flask -y
sudo apt install python3-pillow -y
sudo apt install python3-waitress -y
sudo apt install postgresql -y
sudo -u postgres psql -c "alter user postgres with encrypted password 'XHJUtz6723Lop!';"
sudo -u postgres psql -c "create database sechat;"
sudo -u postgres psql sechat -c "create table users (user_id serial primary key, mail varchar(500), password varchar(500));"
sudo -u postgres psql sechat -c "create table logins (login_id serial primary key, token varchar(500), user_id int);"
sudo -u postgres psql sechat -c "create table shares (share_id serial primary key, token varchar(500), element varchar(500), user_id int);"
sudo systemctl restart postgresql.service
waitress-serve --host 0.0.0.0 --port=80 --threads=50 main:app


