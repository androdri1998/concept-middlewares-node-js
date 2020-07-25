const { isUuid} = require('uuidv4')

function logRequests(req, res, next) {
  const { method, url} = req;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

function validateProjectId(req, res, next) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ 
      error: "BAD_REQUEST", 
      error_description: "Uuid poorly formatted",
    });
  }

  return next();
}

module.exports = {
  logRequests,
  validateProjectId,
};
