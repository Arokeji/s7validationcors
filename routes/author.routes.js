const express = require("express");

// Router de Books
const router = express.Router();

// Modelos
const { Author } = require("../models/Author.js");

// Rutas
// CRUD: Read
// Ejemplo de request con parametros http://localhost:3000/author/?page=2&limit=10
router.get("/", async (req, res) => {
  try {
    // Lectura de query parameters
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const authors = await Author.find()
      .limit(limit)
      .skip((page - 1) * limit);

    // Conteo del total de elementos
    const totalElements = await Author.countDocuments();

    const response = {
      totalItems: totalElements,
      totalPages: Math.ceil(totalElements / limit),
      currentPage: page,
      data: authors
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: Create
router.post("/", async (req, res) => {
  try {
    const author = new Author({
      name: req.body.title,
      country: req.body.author,
    });

    const createdAuthor = await author.save();
    return res.status(200).json(createdAuthor);
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

// CRUD: Read
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const author = await Author.findById(id);

    if (author) {
      res.json(author);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// No CRUD. Busqueda personalizada
router.get("/name/:name", async (req, res) => {
  const title = req.params.title;

  try {
    const author = await Author.find({ title: new RegExp("^" + title.toLowerCase(), "i") });
    if (author) {
      res.json(author);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// CRUD: Delete
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authorDeleted = await Author.findByIdAndDelete(id);
    if (authorDeleted) {
      res.json(authorDeleted);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json();
  }
});

// CRUD: Put
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const authorUpdated = await Author.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (authorUpdated) {
      res.json(authorUpdated);
    } else {
      res.status(404).json({});
    }
  } catch (error) {
    console.error(error);
    if (error?.name === "ValidationError") {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
});

module.exports = { authorRoutes: router };
