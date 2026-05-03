# CloudAssignment

# Setup Guide

## Database setup
The database is to be setup using the GCloud CLI SQL manager, with the following variables.
```env
DB_INSTANCE=backenddb

DB_PASSWORD=1yEDbOF7tiykWIMNhVEwGa5u

DB_USER=backend

DB_NAME=backend

```
A Setup script ```db_setup.sh``` was included to be run within the GCloud Cloud shell and can be executed by 

```cmd
./db_setup.sh
```
Do note however that the details for the database is to be the same as used in the ```.env``` file within the backend directory. 
Which include the variables as follows
```env
DB_INSTANCE=backenddb
DB_PASSWORD=1yEDbOF7tiykWIMNhVEwGa5u
DB_CONN_STRING=davidassignment:europe-west1:backenddb
DB_USER=backend
DB_NAME=backend
DB_PORT=3306
```
Note that DB CONN STRING must be in the format ```[google-project-name]:[region]:[DB_Name]```
# Front End Setup
The Frontend can be setup by ```cd ./frontend``` and running 
```cmd
gcloud app deploy --version frontend-v1
``` 
If a version is required you may include one by including ```--version frontend-v1``` as an argument with the deploy command. The version can be according to your needs.

The Url will be provided upon deployment however the link would come in the format 
```https://[version]-dot-[google-project-name].nw.r.appspot.com```

It is important you update the ```REACT_APP_BACKEND_URL``` variable within the .env file inside the react project folder to the actual URL
of the backend application.

Like so:

```env
REACT_APP_BACKEND_URL="https://backend-dot-davidassignment.nw.r.appspot.com"
```


# Back End Setup
The Backend setup is similar to that of the frontend. By changing directory via ```cd ./frontend``` and running
```cmd
gcloud app deploy --version backend-v1
```
It is important that the ```FRONTEND_URL``` environmental variable within the docker file is updated according to the URL of the frontend application 
in order for the server to assign CORS whitelisting for the frontend, otherwise requests may be rejected.

```dockerfile
FROM python:3.12

ENV FRONTEND_URL="https://frontend-dot-davidassignment.nw.r.appspot.com"

. . .
```

