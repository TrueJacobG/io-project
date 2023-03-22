module.exports = function (app, prefix, db, id) {
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
};
