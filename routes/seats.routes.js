const express = require('express');
const router = express.Router();
const db = require('../db');

router.route('/posts').get((req, res) => {
  res.json(db.posts);
});


router.route('/').get((req, res) => {
  res.json(db.seats);
});

router.route('/:id').get((req, res) => {
  const checkID = db.seats.filter( seat => String(seat.id) ===  req.params.id);
  if (checkID.length > 0) {
    res.json(checkID);
  } else {
    return res.status(404).json({error: 'No data under this id'});
  }
});

router.route('/').post((req, res) => {
  const id = uuidv4();
  const { day, seat, client, email } = req.body;
  if (!day || !seat || !client || !email) {
    return res.json({ error: 'Fills in all fields' });
  }
  db.seats.push({id, day, seat, client, email});
  res.json({message: 'ok'});
});

router.route('/:id').put((req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.json({ error: 'Request body is empty' });
  }
  
  db.seats = db.seats.map( seat => String(seat.id) === req.params.id ? {...seat, ...req.body} : seat);
  
  res.json({message: 'ok'});
});

router.route('/:id').delete((req, res) => {
  
  const index = db.seats.findIndex( seat => String(seat.id) === req.params.id);
  
  if (index <= -1) {
    return res.json({ error: 'No data to delete' });
  }

  db.seats.splice(index, 1);
  res.json({message: 'ok'});
});

module.exports = router;