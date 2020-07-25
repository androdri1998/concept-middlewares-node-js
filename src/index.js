const express = require("express");
const { uuid } = require('uuidv4')

const { logRequests, validateProjectId } = require('./middlewares/requests');

const app = express();

app.use(express.json());
app.use(logRequests);
app.use('/projects/:id', validateProjectId);

const projects = [];

app.get('/projects', (req, res) => {
  const { title } = req.query;
  let serializeProjects = !title 
    ? projects 
    : projects.filter(project => 
        project.title.toLowerCase() === title.toLowerCase());

  return res.json({ projects: serializeProjects });
});

app.post('/projects', (req, res) => {
  const { name } = req.body;
  const project = {
    title: name,
    id: uuid(),
  };
  projects.push(project);
  return res.status(201).json({ 
    message: `Create with name: '${name}' successful`, 
    ...project
  });
});

app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({ 
      error: "NOT_FOUND", 
      error_description: "Project not found",
    });
  }

  const project = {
    id,
    title: name,
  };

  projects[projectIndex] = project;

  return res.status(200).json({ ...project });
});

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0) {
    return res.status(404).json({ 
      error: "NOT_FOUND", 
      error_description: "Project not found",
    });
  }

  projects.splice(projectIndex, 1);

  return res.status(204).json({});
});

app.listen(3333, () => {
  console.log("🚀️ Back-end started!")
});
