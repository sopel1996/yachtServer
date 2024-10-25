# Yacht work manager

![NodeJS](https://img.shields.io/badge/Node.js-339933?logo=Node.js&logoColor=white)

Web application (server) for accounting work on a yacht

## Installation
#### Postgresql Setup

Install postgresql 16
`Ubuntu(VPS)`
```
sudo apt update
sudo apt install postgresql postgresql-contrib
service postgresql
sudo -i -u postgres
createdb {BDNAME}
psql
ALTER USER postgres WITH PASSWORD '{new_password}'; // change password on superuser postrges
CREATE USER {USERNAME} WITH PASSWORD '{PASSWORD}';
ALTER USER {USERNAME} WITH SUPERUSER;
```

`Windows(local)`
download postgresql 16
create new user and database

**{USERNAME}, {PASSWORD} and {BDNAME} search in .env**

Upload .env

Install pm2
```
    sudo npm install pm2 -g
```

Install npm modules
```
npm i
```
#### Start client app
dev mode 
```
npm run dev
```
production
```
npm start (local) 
pm2 start index.js (VPS wia pm2)
```