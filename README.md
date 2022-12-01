# Task-Manager
Simple Node.js Express application. User's can sign up, with username and email, both of which are hashed using base64 encoding and saved into local MongoDB
Database. Each user can create tasks, which will can either be completed or not completed. Users will only be able to view tasks they have created, which
is ensured through authorization middleware. Getting a user's tasks can be sorted by date or status of completetion. API supprts pagination, which can be
extended to the front-end. 
