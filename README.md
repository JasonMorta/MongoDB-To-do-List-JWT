
#  Authentication with JWT

### A simple app that uses JWT to authenticate the user when updates are made.

#### Creating an account will stores the users name, password toDoList array[empty] and JWT Token.
#### On a successfully log-in the server will also send the token which will be stored in localStorage.
#### When making updates, like delete or add, the token will be passed to the server for authentication and make allow the updates. 
- Install as followed
- This will install all the node_modules for back and frontend and start teh application
```bash
  cd to main(backend) folder directory
  npm start 
```