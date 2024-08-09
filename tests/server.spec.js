const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafes", () => {
    test("REQ 1 [GET /cafes] | Deberia retornar un status code 200 y un array con al menos 1 elemento", async () => {
        const response = await request(server).get("/cafes");
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body).toBeInstanceOf(Array);
    });

    test("REQ 2 [DELETE /cafes/:id] | Deberia retornar un status code 404 si intento eliminar dado un id inexistente", async () => {
        const response = await request(server).delete("/cafes/5").set("Authorization", "Bearer");
        expect(response.statusCode).toBe(404);

    });

    test("REQ 3 [POST /cafes] | Deberia retornar un status code 201 y un objeto con el cafe creado", async () => {
        const id = Math.floor(Math.random() * 1000);
        const newCafe = {
            id: id,
            name: "Cafe de Colombia",

        };
        const response = await request(server).post("/cafes").send(newCafe);
        expect(response.statusCode).toBe(201);
        expect(response.body).toContainEqual(newCafe);
    });

    test("REQ 4 [PUT /cafes/:id] | Deberia retornar un status code 400 si intento actualizar un cafe con un id que no corresponde al id dentro del payload", async () => {
        const id = Math.floor(Math.random() * 1000);
        const newCafe = {
            id: 1,
            name: "Cafe de Colombia",
        };
        const response = await request(server).put(`/cafes/${id}`).send(newCafe);
        expect(response.statusCode).toBe(400);
    });

});
