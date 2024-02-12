commands with "" should be written without "" in linux terminal.
'' are mendatory to use.
any CAPSLOCK text must be replaced with your own information!

To install:
1. Connect to your ubuntu server
2. run "sudo su"
3. run "sudo apt update"
4. run "sudo apt install git-core"
5. press "y" to continue
6. run "git clone https://github.com/jonasbraus/Sechat.git"
7. run "cd Sechat"
8. run "sudo chmod +x install.sh"
9. run "./install.sh"
10. Your server is running on http://YOURUBUNTUSERVERIP

Adding an user for login:
1. run "sudo -u postgres psql sechat"
2. run "insert into users (mail, password) values ('YOURMAIL', 'YOUPASSWORD');"
3. type "exit" to leave
4. login with YOURMAIL and YOURPASSWORD
