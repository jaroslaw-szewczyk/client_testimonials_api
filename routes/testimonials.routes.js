const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

router.route('/').get((req, res) => {
  res.json(db.testimonials);
});

router.route('/random').get((req, res) => {
  if (db.testimonials.length === 0) {
    return res.status(404).json({ error: 'Database is empty' });
  }
  const randomPerson = Math.floor(Math.random() * db.testimonials.length);
  const person = db.testimonials[randomPerson];
  res.json(person);
});

router.route('/:id').get((req, res) => {
  const checkID = db.testimonials.filter( person => person.id ===  parseInt(req.params.id));
  if (checkID.length > 0) {
    res.json(checkID);
  } else {
    return res.status(404).json({error: 'No data under this id'});
  }
});

router.route('/').post((req, res) => {
  const id = uuidv4();
  const { author, text } = req.body;
  if (!author || !text) {
    return res.json({ error: 'Fills in all fields' });
  }
  db.testimonials.push({id, author, text});
  res.json({message: 'ok'});
});

router.route('/:id').put((req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.json({ error: 'Request body is empty' });
  }
  
  db.testimonials = db.testimonials.map( person => person.id === parseInt(req.params.id) ? {...person, ...req.body} : person);
  
  res.json({message: 'ok'});
});

router.route('/:id').delete((req, res) => {
  
  const index = db.testimonials.findIndex( person => person.id === parseInt(req.params.id));
  
  if (index <= -1) {
    return res.json({ error: 'No data to delete' });
  }

  db.testimonials.splice(index, 1);
  res.json({message: 'ok'});
});

module.exports = router;