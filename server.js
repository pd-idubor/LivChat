import express from 'express';
// require('dotenv').config()
import router from './routes/index';
const bodyParser = require('body-parser')

const app = express();
const port = process.env.PORT || 5000;


// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({ extended: true }))

// Use this middelware parser for forms?
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
