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

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0); //reduce pega todos os valores que passamos e torna em um só

  return balance;
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

app.use(verifyIfExistsAcconutCpf);
//Todas as seguintes rotas vão usar este middleware

app.get("/statement", (req, res) => {
  const { customer } = req;

  return res.json(customer.statement);
});

app.post("/deposit", (req, res) => {
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

app.post("/withdraw", (req, res) => {
  const { amount } = req.body;
  const { customer } = req;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: "insufficient funds" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
  };

  customer.statement.push(statementOperation);
  return res.status(201).send();
});

app.listen(3333);
