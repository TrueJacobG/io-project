using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using Newtonsoft.Json;
using Firebase.Auth;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Collections;
using Newtonsoft.Json.Linq;
using Firestore.Event.Model;
using Firestore.Event.Expense.DTO;
using Firestore.Event.Expense.Model;
using Firestore.Firebase;

namespace Firestore.Event
{
    [ApiController]
    [Route("api/v1/event")]
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("Config/userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("Config/databaseName.txt"));

        private readonly string eventCollection = "event";
        private readonly string expenseCollection = "expense";


        public EventController(ILogger<EventController> logger)
        {
            _logger = logger;
        }


        #region event
        [EnableCors("Policy1")]
        [HttpGet]
        [Route("", Name = "getEvents")]
        public async Task<IActionResult> GetEvents()
        {
            _logger.LogInformation($"EventModel get Attempt");

            var user = auth.GetUserAsync(Request.Headers["authorization"]).Result;

            Query events = firestoreDb.Collection(eventCollection).WhereEqualTo("creator", user.LocalId);
            QuerySnapshot snap = await events.GetSnapshotAsync();


            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();

            foreach (DocumentSnapshot documentSnapshot in snap.Documents)
            {
                Console.WriteLine("Document data for {0} document:", documentSnapshot.Id);
                var dane = documentSnapshot.ToDictionary();

                Dictionary<string, object> data1 = new Dictionary<string, object>()
            {
                {"id_event", documentSnapshot.Id},
                {"description", dane["description"]},
                {"name", dane["name"] },
                {"add_date", dane["add_date"]}
            };

                Console.WriteLine();

                result.Add(data1);

            }

            return Ok(JsonConvert.SerializeObject(result));
        }


        [EnableCors("Policy1")]
        [HttpPost]
        [Route("", Name = "addEvent")]
        public async Task<IActionResult> Add([FromBody] EventModel model)
        {
            _logger.LogInformation($"EventModel adding Attempt for {model.name}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for event addition for {model.name}");
                return BadRequest(ModelState);
            }
            var user = auth.GetUserAsync(Request.Headers["authorization"]).Result;

            CollectionReference events = firestoreDb.Collection(eventCollection);
            Dictionary<string, object> data1 = new Dictionary<string, object>()
            {
                {"creator", user.LocalId},
                {"description", model.description},
                {"name", model.name},
                {"add_date", Timestamp.GetCurrentTimestamp()},
            };

            ArrayList users = new ArrayList();
            ArrayList expenses = new ArrayList();

            data1.Add("users", users);
            data1.Add("expenses", expenses);

            var a = await events.AddAsync(data1);

            return Ok(JsonConvert.SerializeObject(new { id_event = a.Id }));
        }

        #endregion event


        #region event/{id_event}
        [EnableCors("Policy1")]
        [HttpGet]
        [Route("event/{id_event}", Name = "getEvent")]
        public async Task<IActionResult> GetEvent(string id_event)
        {
            _logger.LogInformation($"EventModel get Attempt");

            Console.WriteLine(id_event);

            DocumentReference events = firestoreDb.Collection("event").Document(id_event);
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
        [Route("event/{id_event}", Name = "deleteEvent")]
        public async Task<IActionResult> Delete(string id_event)
        {
            _logger.LogInformation($"EventModel delete Attempt for {id_event}");


            DocumentReference eventToDelete = firestoreDb.Collection("event").Document(id_event);

            await eventToDelete.DeleteAsync();

            return Ok(JsonConvert.SerializeObject(new { }));
        }
        #endregion event/{uid}
    }
}