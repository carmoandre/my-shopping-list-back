import express from "express";
import cors from "cors";
import joi from "joi";

import connection from "./database.js";

const app = express();
app.use(express.json());
app.use(cors());

const postSchema = joi.object({
    text: joi.string().required(),
});

app.post("/items", async (req, res) => {
    const validation = postSchema.validate(req.body);
    if (validation.error) {
        res.status(400).send("O item da lista não pode ser um texto vazio.");
        return;
    }

    const { text } = req.body;
    try {
        await connection.query(
            `INSERT INTO "shoppingList" (text) VALUES ($1)`,
            [text]
        );

        res.sendStatus(201);
    } catch (err) {
        console.log(err);
        res.status(500).send("Não foi possível inserir o item na lista.");
    }
});

app.get("/items", async (req, res) => {
    try {
        const items = await connection.query(`SELECT * FROM "shoppingList"`);
        if (items.rows.length) {
            res.status(200).send(items.rows);
        } else {
            res.status(404).send("Nenhum item encontrado para a lista");
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Não foi possível recuperar os itens da lista.");
    }
});

export default app;
