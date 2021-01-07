const express = require("express");
const cors = require("cors");

 const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId( request, response, next ){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ erro: 'Invalid reprosity ID.' })
  };

  return next();
};

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const result = title ? repositories.filter(repository => repository.title.includes(title)) : repositories;

  return response.status(200).json(result);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.status(200).json(repository);
});

app.put("/repositories/:id",validateRepositoryId , (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if (repositoryIndex < 0){
    return response.status(400).json({ erro: 'Repository does not exist.'});
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id",validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id );

  if (repositoryIndex < 0){
    return response.status(400).json({ erro: 'Repository does not exist.'});
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like",validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if (repositoryIndex < 0){
    return response.status(400).json({ erro: 'Repository does not exist.' });
  };

  repositories[repositoryIndex].likes++;

  return response.status(200).json(repositories[repositoryIndex]);
});

module.exports = app;
