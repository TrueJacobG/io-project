using Firebase.Auth;
using Firestore.Firebase;
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
                List<string> users = new List<string>();

                foreach (string item in result.GetValue<string[]>("users"))
                {
                    users.Add(await Translator.GetMail(item));
                }
                data = JsonConvert.SerializeObject(new
                {
                    name = result.GetValue<string>("name"),
                    description = result.GetValue<string>("description"),
                    add_date = result.GetValue<Timestamp>("add_date"),
                    users,
                });
            }
            return Ok(data);
        }

        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("{id_event}", Name = "deleteEvent")]
        public async Task<IActionResult> Delete(string id_event)
        {
            _logger.LogInformation($"EventModel delete Attempt for {id_event}");


            DocumentReference eventToDelete = firestoreDb.Collection(eventCollection).Document(id_event);

            await eventToDelete.DeleteAsync();

            return Ok(JsonConvert.SerializeObject(new { }));
        }
    }
}
