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
10. Your server is running on http://YOURUBUNTUSERVERIP<br/>

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
4. <code>localpath</code>: The path, that the files should be stored on your local PC. (The folder must be empty)<br/>.

