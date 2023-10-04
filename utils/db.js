import dotenv from 'dotenv';
import mongoose from 'mongoose';


dotenv.config();

class DBClient {
  constructor() {
    const url = `${process.env.MONGO_URL}`;
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Successfully connected to MongoDB.");
    })
    .catch(err => {
      console.error("Connection error", err);
      process.exit();
    });
  }
  isAlive() {
    mongoose.connection.once('open',function(){
      console.log('Database connected Successfully');
    }).on('error',function(err){
    console.log('Error', err);
    })
  }

}

const dbClient = new DBClient();
export default dbClient;
