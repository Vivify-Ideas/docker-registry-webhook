import mongoose from 'mongoose';

class Config {
  public JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret';

  public DB_HOST = process.env.DB_HOST || 'build-server-mongodb';

  public DB_NAME = process.env.DB_NAME || 'build-server';

  private db: mongoose.Mongoose = null;
  
  async connect() {
    try {
      this.db = await mongoose.connect(`mongodb://${this.DB_HOST}/${this.DB_NAME}`, {
        useNewUrlParser: true
      });
    } catch(e) {
      console.error(e);
    }
  }

  getDB(): mongoose.Mongoose {
    return this.db;
  }
}

const configuration = new Config();
export default configuration;
