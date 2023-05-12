using Firebase.Auth;
using Firestore.FirebaseThings;
using Firestore.Route.Event.Id.User.DTO;
using Firestore.Route.Event.Model;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections;

namespace Firestore.Route.Event.Id
{
    [ApiController]
    [Route("api/v1/event/")]
    public class EventIdController : Controller
    {
        private readonly ILogger<EventController> _logger;
        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("Config/userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("Config/databaseName.txt"));

        private readonly string eventCollection = "event";
        private readonly string expenseCollection = "expense";

        public EventIdController(ILogger<EventController> logger)
        {
            _logger = logger;
        }


        [EnableCors("Policy1")]
        [HttpGet]
        [Route("{id_event}", Name = "getEvent")]
        public async Task<IActionResult> GetEvent(string id_event)
        {
            _logger.LogInformation($"EventModel get Attempt");
            Console.WriteLine(id_event);

            DocumentReference events = firestoreDb.Collection(eventCollection).Document(id_event);
            DocumentSnapshot result = await events.GetSnapshotAsync();
            string data = string.Empty;
            if (result.Exists)
            {
                List<Dictionary<string, string>> users = new List<Dictionary<string, string>>();

                Dictionary<string, string> author = new Dictionary<string, string>()
                    {
                        { "email", await Translator.GetMailByUID(result.GetValue<string>("creator")) },
                        { "username", await Translator.GetUsernameByUID(result.GetValue<string>("creator")) },
                    };

                users.Add(author);

                foreach (string item in result.GetValue<string[]>("users"))
                {
                    Dictionary<string, string> userDisplays = new Dictionary<string, string>()
                    {
                        { "email", await Translator.GetMailByUID(item) },
                        { "username", await Translator.GetUsernameByUID(item) },
                    };

                    users.Add(userDisplays);
                }

                data = JsonConvert.SerializeObject(new
                {
                    name = result.GetValue<string>("name"),
                    description = result.GetValue<string>("description"),
                    add_date = result.GetValue<Timestamp>("add_date"),
                    users,
                });
            }
            return StatusCode(200, data);
        }

        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("{id_event}", Name = "deleteEvent")]
        public async Task<IActionResult> Delete(string id_event)
        {
            _logger.LogInformation($"EventModel delete Attempt for {id_event}");


            DocumentReference eventToDelete = firestoreDb.Collection(eventCollection).Document(id_event);

            DocumentSnapshot eventData = await eventToDelete.GetSnapshotAsync();
            foreach (var expenseId in eventData.GetValue<string[]>("expenses"))
            {
                DocumentReference expenseToDelete = firestoreDb.Collection(expenseCollection).Document(expenseId);
                await expenseToDelete.DeleteAsync();
            }
            await eventToDelete.DeleteAsync();

            return StatusCode(200, JsonConvert.SerializeObject(new { }));
        }

        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("{id_event}/edit", Name = "editEvent")]
        public async Task<IActionResult> Edit([FromBody] EventModel model, string id_event)
        {
            DocumentReference eventToUpdate = firestoreDb.Collection(eventCollection).Document(id_event);
            Dictionary<string, object> update = new Dictionary<string, object>
            {
                { "description", model.description },
                { "name", model.name },
            };
            await eventToUpdate.SetAsync(update, SetOptions.MergeAll);

            return StatusCode(200, JsonConvert.SerializeObject(new { }));

        }

        [EnableCors("Policy1")]
        [HttpGet]
        [Route("{id_event}/finish", Name = "finishEvent")]
        public async Task<IActionResult> Finish(string id_event)
        {
            _logger.LogInformation($"EventModel finish Attempt for {id_event}");

            try
            {
                DocumentReference eventToFinish = firestoreDb.Collection(eventCollection).Document(id_event);
                DocumentSnapshot eventToFinishData = await eventToFinish.GetSnapshotAsync();
                //all users and theirs expense user data
                Dictionary<string, Dictionary<string, double>> userCash = new Dictionary<string, Dictionary<string, double>>
                {
                    { eventToFinishData.GetValue<string>("creator"), new Dictionary<string, double>{ } },
                };

                foreach (string user in eventToFinishData.GetValue<string[]>("users"))
                {
                    userCash.Add(user, new Dictionary<string, double>());
                }
                //for all expenses
                foreach (string expense in eventToFinishData.GetValue<string[]>("expenses"))
                {
                    Console.WriteLine($"EXPENSE:{expense}");

                    DocumentSnapshot eventToFinishExpense = await firestoreDb.Collection(expenseCollection).Document(expense).GetSnapshotAsync();
                    Console.WriteLine($"CREATOR:{await Translator.GetMailByUID(eventToFinishExpense.GetValue<string>("creator"))}");
                    //for all users in one expense
                    foreach (Dictionary<string, string> item in eventToFinishExpense.GetValue<Dictionary<string, string>[]>("users"))
                    {
                        Console.WriteLine($"{item["email"]}//{item["value"]}");
                        //add data about user and their cash to proper userCash column
                        //userCash[eventToFinishExpense?.GetValue<string>("creator")].Add(item?["email"], Convert.ToDouble(item?["value"]));
                    }



                    Console.WriteLine();


                }


                foreach (var item in userCash)
                {
                    Console.Write($"{await Translator.GetUsernameByUID(item.Key)}");
                    foreach (var values in item.Value)
                    {
                        Console.Write($"[{values.Key}/{values.Value}]");
                    }
                    Console.WriteLine();

                }







                //Dictionary<string, Dictionary<string, double>> userCash = new Dictionary<string, Dictionary<string, double>>();
                //userCash.Add(await Translator.GetMailByUID(eventData.GetValue<string>("creator")), new Dictionary<string, double>());


                //Dictionary<string, double> userCash = new Dictionary<string, double>();
                //userCash.Add(await Translator.GetMailByUID(eventData.GetValue<string>("creator")), 0);
                //foreach (string user in eventData.GetValue<string[]>("users"))
                //{
                //    userCash.Add(await Translator.GetMailByUID(user),0);
                //}


                //foreach (var item in userCash)
                //{
                //    Console.WriteLine($"{item.Key} {item.Value}");
                //}
                //Console.WriteLine();

                //foreach (var expenseId in eventData.GetValue<string[]>("expenses"))
                //{
                //    DocumentSnapshot expense = await firestoreDb.Collection(expenseCollection).Document(expenseId).GetSnapshotAsync();

                //    foreach (Dictionary<string, string> expenseUserCash in expense.GetValue<List<Dictionary<string, string>>>("users"))
                //    {
                //        userCash[expenseUserCash["email"]] += Convert.ToDouble(expenseUserCash["value"]);
                //    }




                //    Console.WriteLine();

                //}
                //foreach (var item in userCash)
                //{
                //    Console.WriteLine($"{item.Key} {item.Value}");
                //}


                //Dictionary<string, object> updatedData = new Dictionary<string, object>
                //{
                //    { "status", EventStatus.Closed.ToString() },
                //};
                //await eventToFinish.SetAsync(updatedData, SetOptions.MergeAll);


                return StatusCode(200, JsonConvert.SerializeObject(new { }));
            }
            catch (Exception)
            {
                return StatusCode(404, JsonConvert.SerializeObject(new { message = "Something went really wrong, it should not show this" }));
            }
        }
    }
}
