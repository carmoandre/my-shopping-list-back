import supertest from "supertest";
import connection from "../src/database.js";
import app from "../src/app.js";

afterAll(async () => {
    await connection.end();
});

describe("POST /items", () => {
    beforeEach(async () => {
        await connection.query(`DELETE FROM "shoppingList"`);
    });
    it("returns 201 for valid params", async () => {
        const body = {
            text: "novo item de teste",
        };

        const response = await supertest(app).post("/items").send(body);
        expect(response.status).toEqual(201);
    });
    it("returns 400 for invalid params", async () => {
        const body = {
            text: "",
        };

        const response = await supertest(app).post("/items").send(body);
        expect(response.status).toEqual(400);
    });
});

describe("GET /items", () => {
    beforeEach(async () => {
        await connection.query(`DELETE FROM "shoppingList"`);
    });
    it("returns 200 for found list of items", async () => {
        const body = {
            text: "novo item de teste",
        };

        await supertest(app).post("/items").send(body);
        const response = await supertest(app).get("/items");
        expect(response.status).toEqual(200);
    });
    it("returns 404 for not found list of items", async () => {
        const response = await supertest(app).get("/items");
        expect(response.status).toEqual(404);
    });
});
