# node-mongo-registration-login-api

NodeJS + MongoDB API for User Management, Authentication and Registration

For documentation and instructions check out http://jasonwatmore.com/post/2018/06/14/nodejs-mongodb-simple-api-for-authentication-registration-and-user-management


# Useful info 

The /register route accepts body as shown below

{
    "firstName": "sachin",
    "lastName": "Watmore",
    "username": "customer",
    "password": "my-super-secret-password",
    "role": "customer"
}

To access the /audit api the user must be registerd with role 'auditor'

The /audit api takes the JWT token of auditor role user to show the required details
