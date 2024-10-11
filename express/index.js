const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Add body-parser to handle JSON payloads
const app = express();
const port = 3300;

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define a simple schema and model
const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String
});
const User = mongoose.model('User', UserSchema);

// Middleware
app.use(bodyParser.json()); // Parse JSON payloads
app.use(express.static('public'));

// API endpoint to get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API endpoint to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API endpoint to update a user
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API endpoint to delete a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send('User not found');
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// Serve the index.html file from the public directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});

