'' are mendatory to use. <br/>
any CAPSLOCK text must be replaced with your own information!


<h1>To install:</h1>
1. Connect to your ubuntu server and run followings:<br/>
2. <code>sudo su</code><br/>
3. <code>sudo apt update</code><br/>
4. <code>sudo apt install git-core</code><br/>
5. press "y" to continue<br/>
6. <code>git clone https://github.com/jonasbraus/Sechat.git</code><br/>
7. <code>cd Sechat</code><br/>
8. <code>sudo chmod +x install.sh</code><br/>
9. <code>./install.sh</code><br/>
10. Your server is running on http://YOURUBUNTUSERVERIP<br/>

!Adding an user for login:
1. run "sudo -u postgres psql sechat"
2. run "insert into users (mail, password) values ('YOURMAIL', 'YOUPASSWORD');"
3. type "exit" to leave
4. login with YOURMAIL and YOURPASSWORD

(Stop server):
1. run "screen -r sechat"
2. press "ctrl+c"
3. press "ctrl+a" then "ctrl+d" to leave screen

(Start server again):
1. run "screen -r sechat" (or "screen -S sechat" if error)
2. run "cd Sechat" (if not already in this folder)
3. run "waitress-serve --host 0.0.0.0 --port=80 --threads=50 main:app"

