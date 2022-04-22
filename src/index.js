const express = require("express");
const { v4: uuidv4 } = require("uuid"); //V4 = numeros randomicos

const app = express();
app.use(express.json()); //Receber json

//FakeDB
const customers = [];

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  const id = uuidv4();

  customers.push({ cpf, name, id, statement: [] }); //Inserindo os dados na FakeDB

  return response.status(201).send();
});

app.listen(3333);
