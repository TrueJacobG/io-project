using Firebase.Auth;
using Firestore.FirebaseThings;
using Firestore.Route.Event.Id.User.DTO;
using Firestore.Route.User.Model;
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

            string uid = await Translator.GetUidByEmail(userModel.user_email);

            //if uid is empty, do not add, end fucntion here
            if (uid == string.Empty)
            {
                return StatusCode(400, JsonConvert.SerializeObject(new { message = "There is no user with that email" }));
            }

            DocumentReference eventToUpdate = firestoreDb.Collection(eventCollection).Document(id_event);
            DocumentSnapshot snapshot = await eventToUpdate.GetSnapshotAsync();

            //creator is added by default,
            //end function
            if (uid == snapshot.GetValue<string>("creator"))
            {
                return StatusCode(403, JsonConvert.SerializeObject(new { message = "Creator is always added." }));
            }

            List<string> users = new List<string>();
            if (snapshot.Exists)
            {
                users = snapshot.GetValue<List<string>>("users");
            }
            if(users.Contains(uid))
            {
                return StatusCode(403, JsonConvert.SerializeObject(new { message = "This user is already in event" }));
            }
            else
            {
                users.Add(uid);
            }

            Dictionary<string, object> updates = new Dictionary<string, object>
                {
                    { "users", users }
                };

            await eventToUpdate.UpdateAsync(updates);

            return StatusCode(200, JsonConvert.SerializeObject(new { username = await Translator.GetUsernameByUID(uid) }));
        }


        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("event/{id_event}/user", Name = "deleteUser")]
        public async Task<IActionResult> DeleteUser([FromBody] UserEmailDTO userModel, string id_event)
        {
            _logger.LogInformation($"Attempt for deleting user {userModel.user_email} in event {id_event}");
            string uid = await Translator.GetUidByEmail(userModel.user_email);

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

            return StatusCode(200, JsonConvert.SerializeObject(new { }));
        }
    }
}
