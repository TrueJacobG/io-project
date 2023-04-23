module.exports = function (app, prefix, db, id) {
  app.get(prefix + "event", async (req, res) => {
    let body = req.body;

    let events = await db.getData("/events");

    let result = [];

    events.forEach((ev) => {
      // should be auth ofc
      if (ev.author === body.email) {
        result.push({
          id_event: ev.id_event,
          name: ev.name,
          description: ev.description,
        });
      }
    });

    res.send(JSON.stringify(result));
  });

  app.post(prefix + "event", async (req, res) => {
    let body = req.body;

    let users = await db.getData("/users");

    let id_event = id.randomUUID();
    let event = { author: body.email, id_event: id_event, name: body.name, description: body.description, users: [] };

    await db
      .push("/events[]", event)
      .then(() => {
        res.send(JSON.stringify({ id_event: id_event }));
      })
      .catch((e) => {
        res.status(404);
        res.send(JSON.stringify({ message: e }));
      });
  });

  /* /:id_event */

  app.get(prefix + "event/:id_event", async (req, res) => {
    let id_event = req.params.id_event;
    let body = req.body;

    let events = await db.getData("/events");

    let isSend = false;
    events.forEach(async (ev) => {
      if (ev.id_event === id_event) {
        isSend = true;
        res.send(JSON.stringify({ name: ev.name, description: ev.description }));
      }
    });

    if (!isSend) {
      res.status(404);
      res.send(JSON.stringify({ message: "Not Found!" }));
    }
  });

  app.delete(prefix + "event/:id_event", async (req, res) => {
    let id_event = req.params.id_event;
    let body = req.body;

    let events = await db.getData("/events");

    let index = 0;
    let isSend = false;
    events.forEach(async (ev) => {
      if (ev.id_event === id_event) {
        await db.delete("/events[" + index + "]");
        res.send(JSON.stringify({}));
        isSend = true;
        return;
      }
      index++;
    });

    /* ??? */
    if (isSend) {
      res.status(404);
      res.send(JSON.stringify({ message: "Not Found!" }));
    }
  });

  app.put(prefix + "event/:id_event", async (req, res) => {
    let id_event = req.params.id_event;
    let body = req.body;

    let events = await db.getData("/events");

    let event = {
      author: body.email,
      id_event: id_event,
      name: body.name,
      description: body.description,
      users: [
        /* TODO */
      ],
    };

    let index = 0;
    events.forEach(async (ev) => {
      if (ev.id_event === id_event) {
        await db.delete("/events[" + index + "]");

        await db
          .push("/events[]", event)
          .then(() => {
            res.send(JSON.stringify({}));
          })
          .catch((e) => {
            res.status(404);
            res.send(JSON.stringify({ message: e }));
          });
      }
      index++;
    });
  });

  /* /user */

  app.get(prefix + "event/:id_event/user", async (req, res) => {
    let id_event = req.params.id_event;
    let body = req.body;

    let events = await db.getData("/events");

    events.forEach(async (ev) => {
      if (ev.id_event === id_event) {
        res.send(JSON.stringify({ users: ev.users }));
      }
    });
  });

  app.post(prefix + "event/:id_event/user", async (req, res) => {
    let id_event = req.params.id_event;
    let body = req.body;

    let events = await db.getData("/events");

    let index = 0;
    events.forEach(async (ev) => {
      if (ev.id_event === id_event) {
        await db
          .push("/events[" + index + "]/users[]", body.user_email)
          .then(() => {
            res.send(JSON.stringify({}));
          })
          .catch((e) => {
            res.status(404);
            res.send(JSON.stringify({ message: e }));
          });
      }
      index++;
    });
  });

  app.delete(prefix + "event/:id_event/user", async (req, res) => {
    let id_event = req.params.id_event;
    let body = req.body;

    let events = await db.getData("/events");

    let temp = 0;
    let eventIndex = -1;
    events.forEach(async (ev) => {
      if (ev.id_event === id_event) {
        eventIndex = temp;
      }
      temp++;
    });

    let usersInEvent = await db.getData("/events[" + eventIndex + "]/users");

    let userIndex = 0;
    usersInEvent.forEach(async (u) => {
      if (u === body.user_email) {
        await db.delete("/events[" + eventIndex + "]/users[" + userIndex + "]");
        res.send(JSON.stringify({}));
        return;
      }
      userIndex++;
    });
  });
};
