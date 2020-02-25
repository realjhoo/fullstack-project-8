"use strict";
// REQUIRES
const express = require("express");
const db = require("./db");
const { Book } = require("./db").models;
const Sequelize = require("sequelize");

// Variables and Constants
const app = express();
const Op = Sequelize.Op;

// app set and use
app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: false }));

// =============== Connect to DB ===============
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
// Home Route (Root) * * Working * *
app.get(
  "/",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    if (books) {
      res.render("index", {
        books: books,
        id: books.id,
        windowTitle: "SQL Library Manager",
        items: books.length,
        page: 1,
        search: false
      });
    } else {
      res.sendStatus(404);
    }
  })
);

// Redirect /books -> /
app.get("/books", (req, res) => {
  res.redirect("/");
});

// Search Route
// *************** IN PROGRESS *************
app.post(
  "/",
  asyncHandler(async (req, res) => {
    let searchTerm = req.body.searchTerm.toLowerCase();
    console.log("Search Term: " + searchTerm);
    const books = await Book.findAll({
      where: {
        [Op.or]: {
          title: {
            [Op.like]: `%${searchTerm}%`
          },
          author: {
            [Op.like]: `%${searchTerm}%`
          },
          genre: {
            [Op.like]: `%${searchTerm}%`
          },
          year: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      }
    });

    for (let i = 0; i < books.length; i++) {
      console.log("Search :" + books[i].title);
      console.log(req.query.page);
      // +++++++++++++++++++++
      // const itemsPerPage = 10;
      // const numOfPages = Math.ceil(items / itemsPerPage);
      // let firstItem = page * 10 - 10;
      // let lastItem = firstItem + 10;
      // ++++++++++++++++++++++

      res.render("index", {
        books: books,
        id: books.id,
        windowTitle: "SQL Library Manager",
        items: books.length,
        page: 1,
        search: true
      });
    }
  })
);

// TESTING ========================
// app.get("/search", (req, res) => {
//   res.render("search");
// });

// pagination hack
app.get(
  "/page/:pg",
  asyncHandler(async (req, res) => {
    const books = await Book.findAll();
    if (books) {
      res.render("index", {
        books: books,
        id: books.id,
        windowTitle: "SQL Library Manager",
        items: books.length,
        page: 2
      });
    } else {
      res.sendStatus(404);
    }
  })
);

// New Book Route * * Working * *
app.get("/books/new", (req, res) => {
  res.render("new-book", { windowTitle: "New Book" });
});

// Write new book to DB * * Working * *
app.post(
  "/books/new",
  asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);
    res.redirect("/");
  })
);

// Update Book (get from database) * * Working * *
app.get(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
      res.render("update-book", { book: book, title: book.title });
    } else {
      res.render("error");
    }
  })
);

// Update Book (write to database) * * Working * *
app.post(
  "/books/:id",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.update(req.body);
    res.redirect("/books/");
  })
);

// Delete Book from Database * * Working * *
app.post(
  "/books/:id/delete",
  asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    await book.destroy();
    res.redirect("/books");
  })
);

// =============== error handler ===============
// Set error
app.use((req, res, next) => {
  const err = new Error("Cannot find that... sorry");
  err.status = 404;
  next(err);
});

// Render error page
app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.locals.error = err;
  res.status(err.status);
  res.render("page-not-found", { windowTitle: "Error!" });
  console.log("Error: " + err.status + " " + err.message);
});

// server listening on port 3000
const server = app.listen(3000, () => {
  console.log(
    `Server running on localhost port ${server.address().port} at ` + showTime()
  );
});

// =======================================================
// function to timestamp sever message
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
/* Handler function to wrap each route. 
    with Sequelize Validation Friendly Message*/
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        res.render("invalid");
      }
    }
  };
}

// ========================================================
function bob() {
  console.log("Bob's your uncle");
}
