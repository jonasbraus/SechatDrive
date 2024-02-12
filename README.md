'' are mendatory to use. <br/>
any CAPSLOCK text must be replaced with your own information!


To install:
1. Connect to your ubuntu server and run followings:
2. <code style="color : darkorange">sudo su</code>.
3. run "sudo apt update"
4. run "sudo apt install git-core"
5. press "y" to continue
6. run "git clone https://github.com/jonasbraus/Sechat.git"
7. run "cd Sechat"
8. run "sudo chmod +x install.sh"
9. run "./install.sh"
10. Your server is running on http://YOURUBUNTUSERVERIP

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

