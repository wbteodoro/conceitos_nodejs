const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    };

    repositories.push(repository);

    response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    if(!isUuid(id)) {
        return response.status(400).json({ error: "ID não encontrado!" });
    }

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0) {
        return response.status(400).json({ error: "Repositório não encontrado!" });
    }

    let changeCurrentRepository = repositories[repositoryIndex];
    changeCurrentRepository = { ...changeCurrentRepository, title, url, techs };
    repositories[repositoryIndex] = changeCurrentRepository;

    response.status(200).json(changeCurrentRepository);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    if(!isUuid(id)) {
        return response.status(400).json({ error: "ID não encontrado!" });
    }

    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if(repositoryIndex < 0) {
        return response.status(400).json({ error: "Repositório não encontrado!" });
    }

    repositories.splice(repositoryIndex, 1);

    response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if(!isUuid(id)) {
      return response.status(400).json({ error: "ID não encontrado!" });
  } else if(!repositories.length) {
      return response.status(400).json({ error: "Não existem repositórios cadastrados!" });
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if(repositoryIndex < 0) {
      return response.status(400).json({ error: "Repositório não encontrado!" });
  }

  repositories[repositoryIndex]["likes"] += 1;

  response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
