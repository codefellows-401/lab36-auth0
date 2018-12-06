# Lab 36: Authorization
## Overview
This application provides a demo of an implementation of OAuth 2.0 using a connection to Auth0.com.

## Usage
Download or clone this repository, and then navigate to the directory where the package.json is located and type 'npm install' to install the required depenencies. Once installed open a separate temrinal window and launch an instance of mongodb server. Next in your main terminal window type 'npm start' to launch the servers and deploy the application to http://localhost:3000. You may now access the server via any web browser or API utility tool (e.g. Postman). 

## Routes
The server currently features four distinct routes that are accessible from http://localhost:3000 :
- /home
- /login
- /oauth
- /logout

NOTE: The /oauth route handles the posting of the user to your database.

## Developers
* Jen Carrigan
* Ryan Milton
* Ben Harris