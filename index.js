const express = require('express');
const app = express();
const cafes = require("./cafes.json");

app.listen(3000, console.log("SERVER ON"));

app.use(express.json());

// GET /cafes
app.get("/cafes", (req, res) => {
    res.status(200).send(cafes);
});

// GET /cafes/:id
app.get("/cafes/:id", (req, res) => {
    const { id } = req.params;
    const cafe = cafes.find(c => c.id == id);
    if (cafe) {
        res.status(200).send(cafe);
    } else {
        res.status(404).send({ message: "No se encontró ningún café con ese ID" });
    }
});

// POST /cafes
app.post("/cafes", (req, res) => {
    const cafe = req.body;
    const { id, name } = cafe;

    // Validación de datos
    if (!id || isNaN(id)) {
        return res.status(400).send({ message: "El ID del café es inválido" });
    }
    if (!name) {
        return res.status(400).send({ message: "El nombre del café es obligatorio" });
    }

    const existeUncafeConEseId = cafes.some(c => c.id == id);
    if (existeUncafeConEseId) {
        return res.status(400).send({ message: "Ya existe un café con ese ID" });
    } else {
        cafes.push(cafe);
        res.status(201).send(cafe);
    }
});

// PUT /cafes/:id
app.put("/cafes/:id", (req, res) => {
    const cafe = req.body;
    const { id } = req.params;

    // Validación de datos
    if (id != cafe.id) {
        return res.status(400).send({ message: "El ID del parámetro no coincide con el ID del café recibido" });
    }
    if (!cafe.name) {
        return res.status(400).send({ message: "El nombre del café es obligatorio" });
    }

    const cafeIndexFound = cafes.findIndex((p) => p.id == id);
    if (cafeIndexFound >= 0) {
        cafes[cafeIndexFound] = cafe;
        res.send(cafe);
    } else {
        res.status(404).send({ message: "No se encontró ningún café con ese ID" });
    }
});

// DELETE /cafes/:id
app.delete("/cafes/:id", (req, res) => {
    const jwt = req.header("Authorization");
    if (jwt) {
        const { id } = req.params;
        const cafeIndexFound = cafes.findIndex(c => c.id == id);

        if (cafeIndexFound >= 0) {
            cafes.splice(cafeIndexFound, 1);
            res.send(cafes);
        } else {
            res.status(404).send({ message: "No se encontró ningún café con ese ID" });
        }

    } else {
        res.status(400).send({ message: "No recibió ningún token en las cabeceras" });
    }
});

// Ruta no encontrada
app.use("*", (req, res) => {
    res.status(404).send({ message: "La ruta que intenta consultar no existe" });
});

module.exports = app;
