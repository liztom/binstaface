const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const messages = {};
let id = 0;

app.use(bodyParser.json());

app.get('/messages', (req, res) => {
  res.json(Object.keys(messages).map(key => messages[key]));
});

app.get('/messages/:id', (req, res) => {
	const message = messages[req.params.id];
  if(message) {
  	res.json(message);
  } else {
  	res.sendStatus(404);
  }
});

app.post('/messages/', (req, res) => {
  const messageId = id;
  messages[messageId] = req.body.message;
  id++;
  res.json({ id: messageId, message: messages[messageId] });
  res.sendStatus(201);
});

app.put('/messages/:id', (req, res) => {
	if(messages[req.params.id]) {
		messages[req.params.id] = req.body.message;
	  res.json({ id: id, message: messages[id] });	
	} else {
		res.sendStatus(404);
	}
});

app.delete('/messages/:id', (req, res) => {
	if(messages[req.params.id]) {
		delete messages[req.params.id];	
		res.sendStatus(204);
	} else {
		res.sendStatus(404);
	}
});

app.listen(3000);