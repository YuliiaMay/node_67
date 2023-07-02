const { connect } = require("mongoose");

const connectDB = async () => {
  try {
    const DB = await connect(process.env.DB_URI);
    console.log(
      `DB is connected. Name:${DB.connection.name}. Port: ${DB.connection.port}. Host: ${DB.connection.host}`
        .green.italic.bold.underline
    );
  } catch (error) {
    console.log(error.message.red.bold);
    process.exit(1);
  }
};
module.exports = connectDB;
