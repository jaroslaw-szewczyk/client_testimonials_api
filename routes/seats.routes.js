const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');

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
  const takenSeat = db.seats.some( mySeat => mySeat.seat === seat && mySeat.day === day);
  if (!day || !seat || !client || !email) {
    return res.json({ error: 'Fills in all fields' });
  } else if(takenSeat.length > 0) {
    return res.status(409).json({ message: 'The slot is already taken...' });
  }

  db.seats.push({id, day, seat, client, email});
  req.io.emit('seatsUpdated', db.seats);
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