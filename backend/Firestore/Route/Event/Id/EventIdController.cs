﻿using Firebase.Auth;
using Firestore.FirebaseThings;
using Firestore.Route.Event.Id.DTO;
using Firestore.Route.Event.Model;
using Firestore.Route.User.Model;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Globalization;

namespace Firestore.Route.Event.Id
{
    [ApiController]
    [Route("api/v1/event/")]
    public class EventIdController : Controller
    {
        private readonly ILogger<EventController> _logger;
        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("Config/userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("Config/databaseName.txt"));

        private const string eventCollection = "event";
        private const string expenseCollection = "expense";
        private const string summaryCollection = "summary";

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


        //TODO::: change to summary
        [EnableCors("Policy1")]
        [HttpGet]
        [Route("{id_event}/summary", Name = "getSummary")]
        public async Task<IActionResult> GetFinishedEventData(string id_event)
        {
            _logger.LogInformation($"EventModel get finished debtors Attempt");

            DocumentReference eventFromId = firestoreDb.Collection(eventCollection).Document(id_event);
            DocumentSnapshot eventData = await eventFromId.GetSnapshotAsync();

            if (eventData.Exists)
            {
                DocumentSnapshot summary = await firestoreDb.Collection(summaryCollection).Document(eventData.GetValue<string>("summary")).GetSnapshotAsync();

                if (summary.Exists)
                {
                    List<string> users = new List<string>
                    {
                        eventData.GetValue<string>("creator")
                    };
                    users.AddRange(eventData.GetValue<List<string>>("users"));


                    List<PayerDataDTO> summaryData = new List<PayerDataDTO>();
                    List<Dictionary<string, string>> mailToUsername = new List<Dictionary<string, string>>();

                    foreach (var item in users)
                    {
                        if (summary.TryGetValue<Dictionary<string, double>>(item, out Dictionary<string,double> _))
                        {
                            PayerDataDTO payerData = new PayerDataDTO(await Translator.GetMailByUID(item));

                            mailToUsername.Add(new Dictionary<string, string>()
                            {
                                {"mail", await Translator.GetMailByUID(item)},
                                {"username", await Translator.GetUsernameByUID(item)}
                            });

                            foreach (var debtors in summary.GetValue<Dictionary<string, double>>(item))
                            {
                                payerData.debtors.Add(new Dictionary<string, string>()
                                {
                                    {"email", await Translator.GetMailByUID(debtors.Key) },
                                    {"cash", Math.Round(Convert.ToDouble(debtors.Value),2).ToString()}
                                });
                            }

                            if (payerData.debtors.Count > 0)
                            {
                                summaryData.Add(payerData);
                            }
                        }
                    }

                    return StatusCode(200, JsonConvert.SerializeObject(new { data = summaryData, mailUsername = mailToUsername }));
                }
                else
                {
                    return StatusCode(404, JsonConvert.SerializeObject(new { message = "There is no event summary", }));
                }
            }
            else
            {
                return StatusCode(404, JsonConvert.SerializeObject(new { message = "There is no event" }));
            }
        }

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("{id_event}/summary", Name = "changeSummary")]
        public async Task<IActionResult> ChangeFinishedDAta([FromBody] PayerGiverDTO payerGiver, string id_event)
        {
            _logger.LogInformation($"EventModel get finished debtors Attempt");

            if(!ModelState.IsValid)
            {
                return StatusCode(400, JsonConvert.SerializeObject(new { message = $"something wrong" }));
            }

            DocumentReference eventFromId = firestoreDb.Collection(eventCollection).Document(id_event);
            DocumentSnapshot eventData = await eventFromId.GetSnapshotAsync();

            if (eventData.Exists)
            {
                DocumentReference summary = firestoreDb.Collection(summaryCollection).Document(eventData.GetValue<string>("summary"));
                DocumentSnapshot summaryData = await summary.GetSnapshotAsync();

                Dictionary<string, object> partToUpdate;
                if (summaryData.GetValue<Dictionary<string, double>>(await Translator.GetUidByEmail(payerGiver.fromEmail))[await Translator.GetUidByEmail(payerGiver.toEmail)] == 0)
                {
                    partToUpdate = new Dictionary<string, object>()
                    {
                        {await Translator.GetUidByEmail(payerGiver.fromEmail), FieldValue.Delete}
                    };
                }
                else
                {
                    partToUpdate = new Dictionary<string, object>()
                    {
                        {
                            await Translator.GetUidByEmail(payerGiver.fromEmail),new Dictionary<string, double>()
                            {
                                {await Translator.GetUidByEmail(payerGiver.toEmail), 0 }
                            }
                        },
                    };
                }

                await summary.UpdateAsync(partToUpdate);

                return StatusCode(200, JsonConvert.SerializeObject(new { }));

            }
            else
            {
                return StatusCode(404, JsonConvert.SerializeObject(new { message = "There is no event" }));
            }
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
        [HttpPut]
        [Route("{id_event}", Name = "editEvent")]
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

                //all users and theirs expense user debtors
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

                    string creatorEmail = await Translator.GetMailByUID(eventToFinishExpense.GetValue<string>("creator"));

                    //for all users in one expense
                    foreach (Dictionary<string, string> item in eventToFinishExpense.GetValue<Dictionary<string, string>[]>("users"))
                    {
                        //add debtors about user and their cash to proper userCash column
                        if (item["email"] != creatorEmail)
                        {
                            try
                            {
                                if (userCash[await Translator.GetUidByEmail(item["email"])].Keys.Contains(eventToFinishExpense.GetValue<string>("creator")))
                                {
                                    userCash[await Translator.GetUidByEmail(item["email"])][eventToFinishExpense.GetValue<string>("creator")] += double.Parse(item["value"], CultureInfo.InvariantCulture);
                                }
                                else
                                {
                                    userCash[await Translator.GetUidByEmail(item["email"])].Add(eventToFinishExpense.GetValue<string>("creator"), double.Parse(item["value"], CultureInfo.InvariantCulture));
                                }

                             
                            }
                            catch (Exception e)
                            {
                                Console.WriteLine($"{e.Message}");
                            }
                        }
                    }

                    Console.WriteLine();
                }


                foreach (var item in userCash)
                {
                    foreach (KeyValuePair<string, double> pair in item.Value)
                    {
                        if (userCash[item.Key].Keys.Contains(pair.Key) && userCash[pair.Key].Keys.Contains(item.Key))
                        {
                            if (pair.Value >= userCash[pair.Key][item.Key])
                            {
                                userCash[item.Key][pair.Key] = pair.Value - userCash[pair.Key][item.Key];
                                userCash[pair.Key][item.Key] = 0;
                            }
                            else
                            {
                                userCash[pair.Key][item.Key] = userCash[pair.Key][item.Key] - pair.Value;
                                userCash[item.Key][pair.Key] = 0;
                            }
                        }
                    }
                }

                CollectionReference summarys = firestoreDb.Collection(summaryCollection);

                var summary = await summarys.AddAsync(userCash);

                Dictionary<string, object> eventSummaryUpdate = new Dictionary<string, object>
                {
                    {"summary", summary.Id }
                };

                await eventToFinish.UpdateAsync(eventSummaryUpdate);
                Console.WriteLine("finished");

                return StatusCode(200, JsonConvert.SerializeObject(new { }));
            }
            catch (Exception)
            {
                return StatusCode(404, JsonConvert.SerializeObject(new { message = "Something went really wrong, it should not show this" }));
            }
        }
    }
}
