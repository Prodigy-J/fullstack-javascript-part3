const express = require("express");

const app = express();
app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  return response.json(persons);
});

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 2442);
  const person = request.body;

  person.id = id;

  if (!person.name || !person.number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  const nameFound = persons.find((p) => p.name === person.name);

  if (nameFound) {
    return response.status(400).json({ error: "contact already exists" });
  }

  persons = persons.concat(person);

  response.json(person);
});

app.get("/info", (request, response) => {
  const personsCount = persons.length;
  const date = new Date();

  response.send(
    `<p>Phonebook has info for ${personsCount} people</p>
        </p>${date}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return response.status(404).end();
  }

  return response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);

  persons = persons.filter((person) => person.id !== id);

  return response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
