<h1>What is Sechat Drive?</h1>
A simple drive application for self hosting on linux<br/>

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
6. <code>git clone https://github.com/jonasbraus/Sechat.git</code><br/>
7. <code>cd Sechat</code><br/>
8. <code>sudo chmod +x install.sh</code><br/>
9. <code>./install.sh</code><br/>
10. Your server is running on http://YOURUBUNTUSERVERIP<br/>

<h1>Adding an user for login:</h1>
1. <code>sudo -u postgres psql sechat</code><br/>
2. <code>insert into users (mail, password) values ('YOURMAIL', 'YOUPASSWORD');</code><br/>
3. type <code>exit</code> to leave<br/>
4. login with YOURMAIL and YOURPASSWORD<br/>

<h1>(Stop server):</h1>
1. <code>screen -r sechat</code><br/>
2. press <code>ctrl+c</code><br/>
3. press <code>ctrl+a</code> then <code>ctrl+d</code> to leave screen<br/>

<h1>(Start server again):</h1>
1. <code>screen -r sechat</code> (or <code>screen -S sechat</code> if error)<br/>
2. <code>cd Sechat</code> (if not already in this folder)<br/>
3. <code>waitress-serve --host 0.0.0.0 --port=80 --threads=50 main:app</code><br/>

