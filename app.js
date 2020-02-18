"use strict";
// REQUIRES
const express = require("express");
const db = require("./db");
const { Book } = require("./db").models;

// VARS
const app = express();

// app set and use
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

// =============== ROUTES ===============
// works
app.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    if (books) {
      res.render("index", {
        books: books,
        id: books.id,
        title: "SQL Library Manager"
      });
    } else {
      res.sendStatus(404);
    }
  })
);

// redirect (needed?)
// works
// app.get("/books", (req, res) => {
//   res.redirect("/");
// });

// New Book
// works
app.get("/books/new", (req, res) => {
  res.render("new-book", { title: "New Book" });
});

// Update Book (get from database)
app.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book: book, title: book.title });
    } else {
      res.sendStatus(404);
    }
  })
);

// Update Book (Write to database)
app.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update({ title: "New Title, Bitch" });
    res.redirect("/books/" + book.id);
    // res.send(req.body);
  })
);

// Delete Book (Delete from database)

// =============== error handler ===============
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

// server listening on port 3000
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
