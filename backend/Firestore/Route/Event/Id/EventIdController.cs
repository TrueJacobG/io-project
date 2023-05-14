using Firebase.Auth;
using Firestore.FirebaseThings;
using Firestore.Route.Event.Model;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

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
            else
            {
                return StatusCode(400);
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
                Dictionary<string, Dictionary<string, double>> userCash = new Dictionary<string, Dictionary<string, double>>();
                userCash.Add(eventToFinishData.GetValue<string>("creator"), new Dictionary<string, double>());



                foreach (string user in eventToFinishData.GetValue<string[]>("users"))
                {
                        userCash.Add(user, new Dictionary<string, double>());

                }

                //for all expenses
                foreach (string expense in eventToFinishData.GetValue<string[]>("expenses"))
                {
                    DocumentSnapshot eventToFinishExpense = await firestoreDb.Collection(expenseCollection).Document(expense).GetSnapshotAsync();

                    Console.WriteLine($"EXPENSE:::{expense}");
                    string creatorEmail = await Translator.GetMailByUID(eventToFinishExpense.GetValue<string>("creator"));
                    Console.WriteLine($"CREATOR:::{creatorEmail}");

                    //for all users in one expense
                    foreach (Dictionary<string, string> item in eventToFinishExpense.GetValue<Dictionary<string, string>[]>("users"))
                    {
                        //add data about user and their cash to proper userCash column
                        if (item["email"] != creatorEmail)
                        {
                            Console.WriteLine($"FOUND -> {item["email"]}");
                            if (userCash[eventToFinishExpense.GetValue<string>("creator")].Keys.Contains(item["email"])){
                                userCash[await Translator.GetUidByEmail(item["email"])][eventToFinishExpense.GetValue<string>("creator")] += Convert.ToDouble(item["value"]);
                            }
                            else
                            {
                                userCash[await Translator.GetUidByEmail(item["email"])].Add(eventToFinishExpense.GetValue<string>("creator"), Convert.ToDouble(item["value"]));
                            }
                        }
                    }

                    Console.WriteLine();
                }

                Console.WriteLine("[(userCash)]");

                foreach (var item in userCash)
                {
                    Console.WriteLine($"[{await Translator.GetUsernameByUID(item.Key)}]");
                    foreach (KeyValuePair<string,double> pair in item.Value)
                    {
                        Console.WriteLine($"[{await Translator.GetUsernameByUID(pair.Key)}]--->{pair.Value}");
                        if (userCash[item.Key].Keys.Contains(pair.Key) && userCash[pair.Key].Keys.Contains(item.Key))
                        {
                            Console.WriteLine($"{await Translator.GetUsernameByUID(item.Key)}[{pair.Value}]///{await Translator.GetUsernameByUID(pair.Key)}[{userCash[pair.Key][item.Key]}]");
                            if(pair.Value >= userCash[pair.Key][item.Key])
                            {
                                Console.WriteLine($"First bigger {await Translator.GetUsernameByUID(item.Key)}-{pair.Key}=={pair.Value - userCash[pair.Key][item.Key]}");
                                userCash[item.Key][pair.Key] = pair.Value - userCash[pair.Key][item.Key];
                                userCash[pair.Key][item.Key] = 0;
                            }
                            else
                            {
                                Console.WriteLine("Second bigger");
                            }
                        }
                    }
                    Console.WriteLine();

                }

                Console.WriteLine("FINAL:");
                foreach (var item in userCash)
                {
                    Console.WriteLine($"[{await Translator.GetUsernameByUID(item.Key)}]");
                    foreach (KeyValuePair<string, double> pair in item.Value)
                    {
                        if (pair.Value !=0)
                        {
                            Console.WriteLine($"[{await Translator.GetUsernameByUID(pair.Key)}]--->{pair.Value}");
                        }
                    }
                    Console.WriteLine();

                }

                Dictionary<string, object> updatedData = new Dictionary<string, object>
                {
                    { "status", EventStatus.Closed.ToString() },
                };
                await eventToFinish.SetAsync(updatedData, SetOptions.MergeAll);


                return StatusCode(200, JsonConvert.SerializeObject(new { }));
            }
            catch (Exception)
            {
                return StatusCode(404, JsonConvert.SerializeObject(new { message = "Something went really wrong, it should not show this" }));
            }
        }
    }
}
