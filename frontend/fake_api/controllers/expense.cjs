module.exports = function (app, prefix, db, id) {
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
};
