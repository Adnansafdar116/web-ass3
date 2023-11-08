const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/restful-api', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Item = mongoose.model('Item', itemSchema);

app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  if (name && description) {
    const newItem = new Item({ name, description });
    newItem.save()
      .then(savedItem => {
        res.status(201).send(savedItem);
      })
      .catch(error => {
        console.error('Error saving item:', error);
        res.status(500).send(error);
      });
  } else {
    res.status(400).send('Invalid data');
  }
});

app.get('/api/items', (req, res) => {
  Item.find({})
    .then(items => {
      res.status(200).send(items);
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

app.put('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  const { name, description } = req.body;

  if (name && description) {
    Item.findByIdAndUpdate(itemId, { name, description }, { new: true })
      .then(updatedItem => {
        if (updatedItem) {
          res.status(200).send(updatedItem);
        } else {
          res.status(404).send('Item not found');
        }
      })
      .catch(error => {
        res.status(500).send(error);
      });
  } else {
    res.status(400).send('Invalid data');
  }
});

app.delete('/api/items/:id', (req, res) => {
  const itemId = req.params.id;
  Item.findByIdAndDelete(itemId)
    .then(() => {
      res.status(204).send();
    })
    .catch(error => {
      res.status(500).send(error);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
mongoose.set('debug', true);
