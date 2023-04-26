using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using Newtonsoft.Json;
using Firebase.Auth;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Collections;
using Newtonsoft.Json.Linq;
using Firestore.FirebaseThings;
using Firestore.Route.Event.Model;

namespace Firestore.Route.Event
{
    [ApiController]
    [Route("api/v1/event")]
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("Config/userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("Config/databaseName.txt"));

        private readonly string eventCollection = "event";


        public EventController(ILogger<EventController> logger)
        {
            _logger = logger;
        }


        [EnableCors("Policy1")]
        [HttpGet]
        [Route("", Name = "getEvents")]
        public async Task<IActionResult> GetEvents()
        {
            _logger.LogInformation($"EventModel get Attempt");

            var user = auth.GetUserAsync(Request.Headers["authorization"]).Result;

            Query userEvents = firestoreDb.Collection(eventCollection);
            QuerySnapshot creatorEvents = await userEvents.WhereEqualTo("creator", user.LocalId).GetSnapshotAsync();
            QuerySnapshot groupEvents = await userEvents.WhereArrayContains("users", user.LocalId).GetSnapshotAsync();


            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();

            foreach (DocumentSnapshot documentSnapshot in creatorEvents.Documents)
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

            foreach (DocumentSnapshot documentSnapshot in groupEvents.Documents)
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
                return BadRequest(JsonConvert.SerializeObject(new { message = "Wrong model in Event/add"}));
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
    }
}