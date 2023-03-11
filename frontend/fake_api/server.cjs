const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());
const port = 3000;

const jsonDb = require("node-json-db");
var db = new jsonDb.JsonDB(new jsonDb.Config("./fake_api/fake_database", true, false, "/"));

const id = require("crypto");

const prefix = "/api/v1/";

/* AUTH */

app.post(prefix + "auth/register", async (req, res) => {
  let body = req.body;
  let user = { id_user: id.randomUUID(), username: body.username, email: body.email, auth_data: body.auth_data };

  await db
    .push("/users[]", user)
    .then(() => {
      let message = "User added to database!";
      res.send(JSON.stringify(message));
      console.log(message);
    })
    .catch((e) => {
      console.log(e);
      res.status(409);
      res.send("Can't register user!");
    });
});

app.post(prefix + "auth/login", async (req, res) => {
  let body = req.body;
  let users = await db.getData("/users");
  let found = false;

  users.forEach((u) => {
    if (u.email === body.email && u.auth_data === body.auth_data) {
      res.send(JSON.stringify({ message: "User found!", username: u.username }));
      found = true;
    }
  });

  if (!found) {
    res.status(404);
    res.send(JSON.stringify("User not found!"));
  }
});

/* USERS */

app.get(prefix + "user/:email", async (req, res) => {
  let email = req.params.email;
  let users = await db.getData("/users");
  let found = false;

  users.forEach((u) => {
    if (email === u.email) {
      res.send({ id_user: u.id_user, name: u.name, surname: u.surname, email: u.email });
      found = true;
    }
  });

  if (!found) {
    res.status(404);
    res.send(`User ${email} does not exist in the database!`);
  }
});

/* EVENTS */

app.post(prefix + "event/add", async (req, res) => {
  let body = req.body;
  let event = { id_event: id.randomUUID(), name: body.name, description: body.description, users: ["test@test.com"] };

  await db
    .push("/events[]", event)
    .then(() => {
      res.send(`Event ${event.id_event} saved!`);
    })
    .catch((e) => {
      res.status(500);
      res.send(e);
    });
});

app.post(prefix + "event/add/user", async (req, res) => {
  let body = req.body;

  let events = await db.getData("/events");
  let found = false;

  let i = 0;
  events.forEach(async (ev) => {
    if (ev.id_event === body.id_event) {
      let newEvent = { id_event: ev.id_event, name: ev.name, description: ev.description, users: [...ev.users, body.new_user_email] };
      await db.push(`/events[${i}]`, newEvent);
      res.send(`User ${body.new_user_email} added to event ${ev.name}`);
      found = true;
    }
    i++;
  });

  if (!found) {
    res.status(404);
    res.send(`User ${body.email} does not exist in the database!`);
  }
});

/* EXPENSES */

app.post(prefix + "expense/add", async (req, res) => {
  let body = req.body;
  let expens = {
    id_expens: id.randomUUID(),
    id_event: body.id_event,
    name: body.name,
    amount: body.amount,
    type: body.type,
    description: body.description,
  };

  await db
    .push("/expenses[]", expens)
    .then(() => {
      res.send(`Expens ${expens.id_expens} saved!`);
    })
    .catch((e) => {
      res.status(500);
      res.send(e);
    });
});

/* STATUS */

app.get("/", (req, res) => {
  res.send("api works");
});

app.listen(port, () => {
  console.log("server works");
});
