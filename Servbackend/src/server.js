require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const storage = require('./services/storage');

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    const conn = await connectDB(process.env.MONGO_URI);
    storage.init(conn.connection.db);
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
})();
