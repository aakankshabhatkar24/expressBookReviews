const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user. Username and password are required." });
});

// Task 1: Get the list of books available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let matchingBooks = [];
    const bookKeys = Object.keys(books);

    bookKeys.forEach(key => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let matchingBooks = [];
    const bookKeys = Object.keys(books);

    bookKeys.forEach(key => {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(books[key]);
        }
    });

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

/* ==========================================================================
   Tasks 10 - 13: Async/Await & Promise Implementation using Axios
   ========================================================================== */

// Task 10: Get all books using Async/Await
const BASE_URL = "http://localhost:5000";

public_users.get('/async/books', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching book list", error: error.message });
    }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`${BASE_URL}/isbn/${isbn}`)
        .then(response => res.status(200).json(response.data))
        .catch(error => res.status(404).json({ message: "Book not found", error: error.message }));
});

// Task 12: Get book details based on Author using Async/Await
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found for this author", error: error.message });
    }
});

// Task 13: Get book details based on Title using Async/Await
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`${BASE_URL}/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found with this title", error: error.message });
    }
});

module.exports.general = public_users;