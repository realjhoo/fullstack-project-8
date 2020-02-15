"use strict";
// REQUIRES
const express = require("express");
const db = require("./db");
const Book = require("./db/models/book").Book;
const router = express.Router();

// VARS
const app = express();
let books = [];

// app
app.set("view engine", "pug");
app.use("/static", express.static("public"));

// connect to db
(async () => {
  await db.sequelize.sync();
  try {
    await db.sequelize.authenticate();
    console.log("Connected to database...");
  } catch (error) {
    console.log("Error " + error);
  }
})();

// app.get(
//   "/",
//   asyncHandler(async (req, res) => {
//     const books = await Book.findAll({
//       order: [["title", "ASC"]]
//     });
//     res.render("index", { books: books });
//   })
// );

// root rout = /books
app.get("/", (req, res) => {
  books = [
    {
      id: 1,
      title: "Bad Book",
      author: "Billy Bob Bobby Bill",
      genre: "bad fiction",
      year_published: 1996
    },
    {
      id: 2,
      title: "Good Book",
      author: "Billy Bob Bobby Bill",
      genre: "somewhat better fiction",
      year_published: 1998
    },
    {
      id: 3,
      title: "Best Book",
      author: "Billy Bob Bobby Bill",
      genre: "Much improved fiction",
      year_published: 2001
    }
  ];
  res.render("index", {
    books: books
  });
});

app.get("/books", (req, res) => {
  res.redirect("/");
});

// get /books/new
app.get("/books/new", (req, res) => {
  res.render("new-book", { title: "New Book" });
});

// post /books/new
app.post("/books/new", (req, res) => {
  res.render("new-book", { title: "New Book" });
});

// *********************************
// TEMP BOOK-DETAIL
app.get("/books/update", (req, res) => {
  res.render("update-book", { title: "Book Title" });
});

// where id is the db id
// get /books/:id
// app.get("/books/:id", (req, res) => {
//   // const book = await Book.findByPk(req.params.id);
//   res.render("new-book", { title: book });
// });

// post /books/:id
// app.post("/books/:id", (req, res) => {
//   res.render("books:id");
// });

// post /books/:id/delete
// app.get("/books/:id", (req, res) => {
//   res.render("books/:id/delete");
// });

// testing route
app.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book");
    } else {
      res.sendStatus(404);
    }
  })
);

// /error
// app.get("/error", (req, res) => {
//   res.render("error");
// });
// ========== error handler ==========
// set error
app.use((req, res, next) => {
  const err = new Error("Cannot find that... sorry");
  err.status = 404;
  next(err);
});
// render error page
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.locals.error = err;
  res.status(err.status);
  res.render("error", { title: "Error!" });
  console.log("Error: " + err.status + " " + err.message);
});

const server = app.listen(3000, () => {
  console.log(
    `Server running on localhost port ${server.address().port} at ` + showTime()
  );
});

// =======================================================
function showTime() {
  const now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  let timeStamp = hour + ":" + minutes + ":" + seconds;
  return timeStamp;
}

// ========================================================
/* Handler function to wrap each route. */
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}
