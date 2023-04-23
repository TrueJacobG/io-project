const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

const prefix = "/api/v1/";
const jsonDb = require("node-json-db");
const db = new jsonDb.JsonDB(new jsonDb.Config("./fake_api/fake_database", true, false, "/"));
const id = require("crypto");

/* CONTROLLERS */

require("./controllers/auth.cjs")(app, prefix, db, id);
require("./controllers/event.cjs")(app, prefix, db, id);
require("./controllers/user.cjs")(app, prefix, db, id);
require("./controllers/expense.cjs")(app, prefix, db, id);

/* STATUS */

app.get("/", (req, res) => {
  res.send("api works");
});

app.listen(3000, () => {
  console.log("server works");
});
