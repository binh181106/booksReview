const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Route to handle user registration
public_users.post("/register", (req,res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {

      let bookList = await new Promise((resolve) => setTimeout(() => resolve(books), 1000));

  
      console.log("Books List:", bookList);

      res.status(200).json(bookList);
  } catch (error) {
      res.status(500).json({ message: "Failed to fetch book list" });
  }
});



// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
      let isbn = Number(req.params.isbn);

      // Simulate an async operation (e.g., fetching from a database)
      let bookDetails = await getBookByISBN(isbn);

      if (bookDetails) {
          res.send(bookDetails);
      } else {
          res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
      }
  } catch (error) {
      res.status(500).json({ message: "Internal server error" });
  }
});

// Simulated async function to fetch book details
async function getBookByISBN(isbn) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (books[isbn]) {
              resolve(books[isbn]);
          } else {
              reject(null);
          }
      }, 1000);
  });
}

// Get book details based on author
public_users.get('/author/:author',async (req, res)=> {
  try {
    let author = req.params.author;
    let booksDetail = await getBookByAuthor(author);
  
    if (booksDetail.length >0){
      res.send(booksDetail);
    }else {
      return res.status(404).json({ message: `No books found by ${author}` });
    };

  } catch (error) {
    return res.status(500).json({message:"Internal server error"});
  }
});

async function getBookByAuthor(author){
  return new Promise((resolve) =>{
    setTimeout(() => {
      let bookList = books.filter((book)=> {
        return book.author == author;
      });
      resolve(bookList);
    }, 2000)
  })
};

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    let title = req.params.title;
    let booksDetail = await getBookByTitle(title);

    if (booksDetail.length > 0) {
      return res.send(booksDetail);
     
    } else {
      return res.status(404).json({ message: `No books found with title "${title}"` });
    }

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

async function getBookByTitle(title) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let bookList = Object.values(books).filter((book) => book.title === title);
      resolve(bookList);
    }, 2000);
  });
}
//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  try {
    let isbn = req.params.isbn;
    let bookReview = await getBookReviewByISBN(isbn);

    if (bookReview) {
      return res.send(bookReview)
    } else {
      return res.status(404).json({ message: `No reviews found for ISBN ${isbn}` });
    }

  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

async function getBookReviewByISBN(isbn) {
  return new Promise((resolve) => {
    setTimeout(() => {
      let book = books[isbn];
      resolve(book ? book.reviews : null);
    }, 2000);
  });
}


module.exports.general = public_users;
