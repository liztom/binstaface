const express = require('express');
const bodyParser = require('body-parser');

module.exports = function appFunc() {
  const app = express();

  const messages = {};
  let idTracker = 1;

  app.use(bodyParser.json());

  app.get('/messages', (req, res) => {
    const allMessages = Object.keys(messages).map(function mappingKeys(key) {
      return { id: key, message: messages[key] };
    });
    res.json(allMessages);
  });

  app.get('/messages/:id', (req, res) => {
    const message = messages[req.params.id];
    if (message) {
      res.json({ id: req.params.id, message });
    } else {
      res.sendStatus(404);
    }
  });

  app.post('/messages/', (req, res) => {
    const messageId = idTracker;
    messages[messageId] = req.body.message;
    idTracker += 1;
    res.json({ id: messageId, message: messages[messageId] });
  });

  app.put('/messages/:id', (req, res) => {
    const id = req.params.id;
    if (messages[id]) {
      messages[id] = req.body.message;
      res.json({
        id,
        message: messages[id],
      });
    } else {
      res.sendStatus(404);
    }
  });

  app.delete('/messages/:id', (req, res) => {
    if (messages[req.params.id]) {
      delete messages[req.params.id];
      res.sendStatus(204);
    } else {
      res.sendStatus(404);
    }
  });

  return app;
};
