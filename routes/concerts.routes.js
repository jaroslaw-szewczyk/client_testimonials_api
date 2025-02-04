const express = require('express');
const router = express.Router();
const db = require('../db');

router.route('/').get((req, res) => {
  res.json(db.concerts);
});

router.route('/:id').get((req, res) => {
  const checkID = db.concerts.filter( concert => concert.id ===  parseInt(req.params.id));
  if (checkID.length > 0) {
    res.json(checkID);
  } else {
    return res.status(404).json({error: 'No data under this id'});
  }
});

router.route('/').post((req, res) => {
  const id = uuidv4();
  const { performer, genre, price, day, image } = req.body;
  if (!performer || !genre || !price || !day || !image) {
    return res.json({ error: 'Fills in all fields' });
  }
  db.concerts.push({id, performer, genre, price, day, image});
  res.json({message: 'ok'});
});

router.route('/:id').put((req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.json({ error: 'Request body is empty' });
  }
  
  db.concerts = db.concerts.map( concert => concert.id === parseInt(req.params.id) ? {...concert, ...req.body} : concert);
  
  res.json({message: 'ok'});
});

router.route('/:id').delete((req, res) => {
  
  const index = db.concerts.findIndex( concert => concert.id === parseInt(req.params.id));
  
  if (index <= -1) {
    return res.json({ error: 'No data to delete' });
  }

  db.concerts.splice(index, 1);
  res.json({message: 'ok'});
});

module.exports = router;