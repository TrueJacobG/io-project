using Firebase.Auth;
using Firestore.Firebase;
using Firestore.Route.Event.Id.User.DTO;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Firestore.Route.Event.Id.User
{
    [ApiController]
    [Route("api/v1/")]
    public class EventIdUserController : Controller
    {
        private readonly ILogger<EventController> _logger;
        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("Config/userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("Config/databaseName.txt"));

        private readonly string eventCollection = "event";


        public EventIdUserController(ILogger<EventController> logger)
        {
            _logger = logger;
        }

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("event/{id_event}/user", Name = "addUser")]
        public async Task<IActionResult> AddUser([FromBody] UserEmailDTO userModel, string id_event)
        {
            _logger.LogInformation($"Attempt for adding user {userModel.user_email} in event {id_event}");

            string uid = await Translator.GetUid(userModel.user_email);

            if (uid == string.Empty)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "There is no user with that email" }));
            }

            DocumentReference eventToUpdate = firestoreDb.Collection(eventCollection).Document(id_event);

            DocumentSnapshot snapshot = await eventToUpdate.GetSnapshotAsync();
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

            await eventToUpdate.UpdateAsync(updates);

            return Ok(JsonConvert.SerializeObject(new { ok = "ok" }));
        }


        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("event/{id_event}/user", Name = "deleteUser")]
        public async Task<IActionResult> DeleteUser([FromBody] UserEmailDTO userModel, string id_event)
        {
            _logger.LogInformation($"Attempt for deleting user {userModel.user_email} in event {id_event}");
            string uid = await Translator.GetUid(userModel.user_email);

            DocumentReference events = firestoreDb.Collection(eventCollection).Document(id_event);

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
    }
}
