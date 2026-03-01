require("dotenv").config();

const connectToDB = require("./src/config/db.config");
const app = require("./src/app");

const port = process.env.PORT || 3000;

connectToDB();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
