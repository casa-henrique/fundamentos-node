const express = require("express");
const { v4: uuidv4 } = require("uuid"); //V4 = numeros randomicos

const app = express();
app.use(express.json()); //Receber json

//FakeDB
const customers = [];

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlredyExists = customers.some(
    (customer) => customer.cpf === cpf
  ); //some é um método de busca com retorno booleano

  if (customerAlredyExists) {
    return response.status(400).json({ error: "Customer already exists" });
  }

  customers.push({ cpf, name, id: uuidv4(), statement: [] }); //Inserindo os dados na FakeDB

  return response.status(201).send();
});

app.get("/statement/:cpf", (request, response) => {
  const { cpf } = request.params;

  const customer = customers.find((customer) => customer.cpf === cpf); //find retorna um objeto

  return response.json(customer.statement);
});

app.listen(3333);
