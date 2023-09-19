import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const db = process.env.DB_DATABASE || 'files_manager';
    const port = process.env.DB_PORT || 27017;
    // const url = `mongodb://${host}:${port}`;
    const url = `mongodb+srv://precious:BVrusc3d0Bkud0Ub@cluster0.vb6vshg.mongodb.net/?retryWrites=true&w=majority`;
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
      if (err) {
        console.log(err.message);
        this.db = false;
      } else {
        this.db = client.db(db);
      }
    });
  }

  isAlive() {
    return !!this.db;
  }
}

const dbClient = new DBClient();
export default dbClient;
