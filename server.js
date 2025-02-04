const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

let db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
];

app.get('/testimonials', (req, res) => {
  res.json(db);
});

app.get('/testimonials/random', (req, res) => {
  if (db.length === 0) {
    return res.status(404).json({ error: 'Database is empty' });
  }
  const randomPerson = Math.floor(Math.random() * db.length);
  const person = db[randomPerson];
  res.json(person);
});

app.get('/testimonials/:id', (req, res) => {
  const checkID = db.filter( person => person.id ===  parseInt(req.params.id));
  if (checkID.length > 0) {
    res.json(checkID);
  } else {
    return res.status(404).json({error: 'No data under this id'});
  }
});

app.post('/testimonials', (req, res) => {
  const id = uuidv4();
  const { author, text } = req.body;
  if (!author || !text) {
    return res.json({ error: 'Fills in all fields' });
  }
  db.push({id, author, text});
  res.json({message: 'ok'});
});

app.put('/testimonials/:id', (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.json({ error: 'Request body is empty' });
  }
  
  db = db.map( person => person.id === parseInt(req.params.id) ? {...person, ...req.body} : person);
  
  res.json({message: 'ok'});
});

app.delete('/testimonials/:id', (req, res) => {
  
  const index = db.findIndex( person => person.id === parseInt(req.params.id));
  
  if (index <= -1) {
    return res.json({ error: 'No data to delete' });
  }

  db.splice(index, 1);
  res.json({message: 'ok'});
});

app.use((req, res) => {
  res.status(404).send('404 not found...');
});

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});