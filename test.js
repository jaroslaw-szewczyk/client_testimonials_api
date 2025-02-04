app.get('/seats', (req, res) => {
  res.json(db.seats);
});

app.get('/seats/:id', (req, res) => {
  const checkID = db.seats.filter( seat => concert.id ===  parseInt(req.params.id));
  if (checkID.length > 0) {
    res.json(checkID);
  } else {
    return res.status(404).json({error: 'No data under this id'});
  }
});

app.post('/seats', (req, res) => {
  const id = uuidv4();
  const { day, seat, client, email } = req.body;
  if (!day || !seat || !client || !email) {
    return res.json({ error: 'Fills in all fields' });
  }
  db.seats.push({id, day, seat, client, email});
  res.json({message: 'ok'});
});

app.put('/seats/:id', (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.json({ error: 'Request body is empty' });
  }
  
  db.seats = db.seats.map( seat => seat.id === parseInt(req.params.id) ? {...seat, ...req.body} : seat);
  
  res.json({message: 'ok'});
});

app.delete('/seats/:id', (req, res) => {
  
  const index = db.seats.findIndex( seat => seat.id === parseInt(req.params.id));
  
  if (index <= -1) {
    return res.json({ error: 'No data to delete' });
  }

  db.seats.splice(index, 1);
  res.json({message: 'ok'});
});