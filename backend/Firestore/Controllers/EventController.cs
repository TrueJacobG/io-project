using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using Newtonsoft.Json;
using Firestore.Models;
using Firebase.Auth;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Collections;
using Newtonsoft.Json.Linq;

namespace Firestore.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class EventController : ControllerBase
    {
        private readonly ILogger<EventController> _logger;
        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("databaseName.txt"));


        public EventController(ILogger<EventController> logger)
        {
            _logger = logger;
        }


        //TODO: authentication of events (check for same name and uid)

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("event", Name = "add")]
        public async Task<IActionResult> Add([FromBody] EventModel model)
        {
            _logger.LogInformation($"EventModel adding Attempt for {model.name}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for event addition for {model.name}");
                return BadRequest(ModelState);
            }
            var user = auth.GetUserAsync(Request.Headers["authorization"]).Result;

            CollectionReference events = firestoreDb.Collection("event");
            Dictionary<string, object> data1 = new Dictionary<string, object>()
            {
                {"creator", user.LocalId},
                {"description", model.description},
                {"name", model.name},
                {"user_email", user.Email},
                {"add_date", Timestamp.GetCurrentTimestamp()},
            };

            ArrayList users = new ArrayList();
            data1.Add("users", users);

            var a = await events.AddAsync(data1);

            return Ok(JsonConvert.SerializeObject(new { id_event = a.Id }));
        }

        //TODO: return as events, not as cramped json
        [EnableCors("Policy1")]
        [HttpGet]
        [Route("event", Name = "getall")]
        public async Task<IActionResult> GetEvents()
        {
            _logger.LogInformation($"EventModel get Attempt");

            var user = auth.GetUserAsync(Request.Headers["authorization"]).Result;

            Query events = firestoreDb.Collection("event").WhereEqualTo("creator", user.LocalId);
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
        [Route("event/{id_event}/user", Name = "adduser")]
        public async Task<IActionResult> AddUser([FromBody] UserInEventModel userModel, string id_event)
        {
            _logger.LogInformation($"Attempt for adding user {userModel.user_email} in event {id_event}");
            string uid = await Translator.GetUid(userModel.user_email);

            DocumentReference events = firestoreDb.Collection("event").Document(id_event);

            DocumentSnapshot snapshot = await events.GetSnapshotAsync();
            List<string> users = new List<string>();
            if (snapshot.Exists)
            {
                users = snapshot.GetValue<List<string>>("users");
            }
            users.Add(uid);

            Dictionary<string, object> updates = new Dictionary<string, object>
            {
                { "users", users }
            };

            await events.UpdateAsync(updates);

            return Ok(JsonConvert.SerializeObject(new { }));
        }


        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("event/{id_event}/user", Name = "deleteuser")]
        public async Task<IActionResult> DeleteUser([FromBody] UserInEventModel userModel, string id_event)
        {
            _logger.LogInformation($"Attempt for adding user {userModel.user_email} in event {id_event}");
            string uid = await Translator.GetUid(userModel.user_email);

            DocumentReference events = firestoreDb.Collection("event").Document(id_event);

            DocumentSnapshot snapshot = await events.GetSnapshotAsync();
            List<string> users = new List<string>();
            if (snapshot.Exists)
            {
                users = snapshot.GetValue<List<string>>("users");
            }
            users.Remove(uid);

            Dictionary<string, object> updates = new Dictionary<string, object>
            {
                { "users", users }
            };

            await events.UpdateAsync(updates);

            return Ok(JsonConvert.SerializeObject(new { }));
        }

        //event/:id_event/user

        [EnableCors("Policy1")]
        [HttpGet]
        [Route("event/{uid}", Name = "getone")]
        public async Task<IActionResult> GetEvent(string uid)
        {
            _logger.LogInformation($"EventModel get Attempt");

            Console.WriteLine(uid);

            DocumentReference events = firestoreDb.Collection("event").Document(uid);
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
                    users = users,
                });

            }

            return Ok(data);
        }


        //*event/:id_event/user 	
        //body user_email
        //post
     
    }
}