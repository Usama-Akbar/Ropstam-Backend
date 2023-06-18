# Documentation: Starting Express.js Developer Guide

   ## POSTMAN Collection Link 

   
 **https://drive.google.com/file/d/1HvVXMNKT4BIvTK-o0xbcCn7ABLo7ZuKO/view?usp=sharing**
   
  ## Installation and Setup
  

 ### API Endpoints
 
 **5.1**  Car CRUD <br>
**5.1.1** Create a Car <br>
**5.1.2** Retrieve All Cars <br>
**5.1.3** Retrieve a Single Car <br>
**5.1.4** Update a Car <br>
**5.1.5** Delete a Car <br>
**5.2**   Users Management <br>
**5.2.1** User Registration <br>
**5.2.2** User Login <br>
**5.2.3** Retrieve User Details <br>
**5.2.4** Update User Details <br>
**5.2.5** Reset User Password <br>
**5.2.6** Delete User Account <br>
**5.2.7** Upload Media File <br>
**5.2.8** Get Media Files <br>
**5.2.9** Delete Media File <br>

### Introduction
This documentation serves as a guide for backend Express.js developers working on the Car CRUD and Users Management project. The project involves creating a RESTful API to perform CRUD operations on car data and managing user accounts.

### Technologies Used
The backend of the project is built using the following technologies:

**Node.js** : JavaScript runtime environment
**Express.js**: Web application framework for Node.js
**MongoDB**: NoSQL database for storing car and user data
**JWT**: JSON Web Tokens for user authentication
**RESTful API principles**: HTTP methods and status codes for communication
**joi**: Data Validations
**S3**: AWS Media Storage
### Project Structure
The project follows a common structure for an Express.js application. Here is an overview of the important files and directories:<br>

**app.js**: Entry point of the application<br>

**routes/**: Contains route files for car and user endpoints<br>

**middlewares/**: Contains middleware functions for authentication and error handling<br>

**upload/**: Contains Uploaded files that goes from multer to AWS S3 Bucketv

**utils/**: Contains utility schemas and validations used throughout the application<br>

### Installation and Setup
To set up the project on your local machine, follow these steps:

Clone the repository from the provided source.

Navigate to the project directory.

Run npm install to install the required dependencies.

Create a .env file based on the provided .env.example file and configure the environment variables.

Run npm start to start the application.

