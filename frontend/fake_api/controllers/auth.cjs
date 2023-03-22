module.exports = function (app, prefix, db, id) {
  app.get(prefix + "auth/login", async (req, res) => {
    let body = req.body;
    let users = await db.getData("/users");
    let found = false;

    users.forEach((u) => {
      if (u.email === body.email && u.auth_data === body.auth_data) {
        res.status(200);
        res.send(JSON.stringify({ auth_data: u.auth_data, username: u.username }));
        found = true;
      }
    });

    if (!found) {
      res.status(404);
      res.send(JSON.stringify({ message: "User not found!" }));
    }
  });

  app.get(prefix + "auth/register", async (req, res) => {
    let body = req.body;
    let user = { id_user: id.randomUUID(), username: body.username, email: body.email, auth_data: body.auth_data };

    await db
      .push("/users[]", user)
      .then(() => {
        // auth_data should be hash ofc
        res.status(200);
        res.send(JSON.stringify({ auth_data: body.auth_data }));
      })
      .catch((e) => {
        console.log(e);
        res.status(409);
        res.send(JSON.stringify({ message: "Can't register to database!" }));
      });
  });
};
