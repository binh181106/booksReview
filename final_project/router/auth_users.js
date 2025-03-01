const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let userWithSameName = users.filter((user)=>{
    return user.username == username;
  });
  if (userWithSameName.length > 0){
    return false;
  } else{
    return true;
  }
}

const authenticatedUser = (username,password)=>{ 
  let validUser = users.filter((user)=>{
    return user.username == username && user.password == password;
  })
  return validUser.length > 0; 
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message:"Error while login"});
  };

  if (authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data:password
    }, 'access', {expiresIn: 60*60});

    req.session.authorization = {accessToken, username};
    

    return res.status(203).json.send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid username or password"});
  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
