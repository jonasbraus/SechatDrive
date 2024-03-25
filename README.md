<h1>What is Sechat Drive?</h1>
A simple drive application for self hosting on linux<br/>
<i>also supported on windows and mac --> no installation guide available</i>

<h1>Please note that:</h1>
- <code>''</code> are mendatory to use. <br/>
- any CAPSLOCK text must be replaced with your own information!<br/>
- the install script will only work on linux distros supporting apt

<h1>To install:</h1>
1. Connect to your ubuntu server and run the following:<br/>
2. <code>sudo su</code><br/>
3. <code>sudo apt update</code><br/>
4. <code>sudo apt install git-core</code><br/>
5. press <code>y</code> to continue<br/>
6. <code>git clone https://github.com/jonasbraus/SechatDrive.git</code><br/>
7. <code>cd SechatDrive</code><br/>
8. <code>sudo chmod +x install.sh</code><br/>
9. <code>./install.sh</code><br/>
10. Your server is running on http://YOURUBUNTUSERVERIP:5000<br/>

<h1>Use NGINX and certbot for https</h1>
If you want to use https you should install nginx.<br/>
1. <code>sudo apt install nginx</code><br/>
x. Buy a domain online and create an A record to your server. <br/>
2. <code>sudo apt install certbot</code><br/>
3. <code>certbot certonly</code> follow the certbot steps for your domain<br/>
4. <code>cd /etc/nginx</code><br/>
5. <code>sudo nano nginx.conf</code><br/>
6. Below <code>include /etc/nginx/sites-enabled/*</code> add:<br/>
<code>server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name YOURDOMAIN;
    ssl_certificate PATH_TO_FULLCHAIN.PEM;
    ssl_certificate_key PATH_TO_PRIVATEKEY.PEM;
    ssl_protocols TLSv1.3;
    ssl_session_timeout 1d;
    client_max_body_size 20000M;
    keepalive_timeout 65;
    keepalive_requests 1000;
    location / {
      proxy_pass http://127.0.0.1:5000/;
    }
  }
</code>
PATH_TO_FULLCHAIN.PEM and PATH_TO_PRIVATEKEY.PEM should be the path you saved your certbot keyfiles to.<br/>
By default it should be in <code>/etc/letsencrypt</code><br/>
7. <code>sudo systemctl restart nginx.service</code>


<h1>Adding an user for login:</h1>
1. <code>sudo -u postgres psql sechat</code><br/>
2. <code>insert into users (mail, password) values ('YOURMAIL', 'YOURPASSWORD');</code><br/>
3. type <code>exit</code> to leave<br/>
4. login with YOURMAIL and YOURPASSWORD<br/>

<h1>(Stop server):</h1>
1. <code>screen -r sechat</code><br/>
2. press <code>ctrl+c</code><br/>
3. press <code>ctrl+a</code> then <code>ctrl+d</code> to leave screen<br/>

<h1>(Start server again):</h1>
1. <code>screen -R sechat</code><br/>
2. <code>cd Sechat</code> (if not already in this folder)<br/>
3. <code>waitress-serve --host 0.0.0.0 --port=80 --threads=50 main:app</code><br/>

<h1>Local Connector</h1>
The local connector script syncs changes from the drive to your local PC.<br/>
For setup you need to enter your credentials in <code>config.json</code>:<br/>
1. <code>username</code>: Your username for drive login.<br/>
2. <code>password</code>: Your password for drive login.<br/>
3. <code>weburl</code>: The URL that you use to access your drive online.<br/>
4. <code>localpath</code>: The path, that the files should be stored on your local PC. (The folder must be empty).<br/>

