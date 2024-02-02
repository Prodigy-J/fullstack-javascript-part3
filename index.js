require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const person = request.body;

  if (!person.name || !person.number) {
    response.status(400).json({ error: "name or number is missing" });
  }

  Person.exists({ name: person.name }).then((result) => {
    if (result === null) {
      const newContact = new Person({
        name: person.name,
        number: person.number,
      });

      newContact.save().then((person) => {
        response.json(person);
      });
    } else {
      response.status(400).json({ error: "contact already exists" });
    }
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    const length = persons.length;
    const date = new Date();
    response.send(
      `<p>Phonebook has info for ${length} people</p>
          </p>${date}</p>`
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) response.status(404).end();
      else response.json(person);
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      response.status(204).end();
    })
    .catch((error) => {
      next(error);
    });
});

const errorHandler = (error, request, response, next) => {
  console.log("Error Name:", error.name);
  console.log("Error Message:", error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
