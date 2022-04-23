const express = require("express");
const { v4: uuidv4 } = require("uuid"); //V4 = numeros randomicos

const app = express();
app.use(express.json()); //Receber json

//FakeDB
const customers = [];

//Middleware
function verifyIfExistsAcconutCpf(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf); //find retorna um objeto

  if (!customer) {
    return res.status(400).json({ error: "Customer not found" });
  }

  req.customer = customer;

  return next();
}

app.post("/account", (req, res) => {
  const { cpf, name } = req.body;

  const customerAlredyExists = customers.some(
    (customer) => customer.cpf === cpf
  ); //some é um método de busca com retorno booleano

  if (customerAlredyExists) {
    return res.status(400).json({ error: "Customer already exists" });
  }

  customers.push({ cpf, name, id: uuidv4(), statement: [] }); //Inserindo os dados na FakeDB

  return res.status(201).send();
});

//app.use(verifyIfExistsAcconutCpf);
//Todas as seguintes rotas vão usar este middleware

app.get("/statement", verifyIfExistsAcconutCpf, (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

app.post("/deposit", verifyIfExistsAcconutCpf, (req, res) => {
  const { description, amount } = req.body;

  const { customer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  customer.statement.push(statementOperation);

  return res.status(201).send();
});

app.listen(3333);
