//using Google.Cloud.Firestore;
//using Microsoft.AspNetCore.Mvc;
//using Firestore.Models;
//using Microsoft.AspNetCore.Cors;
//using Newtonsoft.Json;
//using FirebaseAdmin.Auth;
//using FirebaseAdmin;
//using Firebase.Auth.Providers;
//using Firebase.Auth;
//using Microsoft.Extensions.Logging;
//using System.Security.Claims;

//namespace Firestore.Controllers
//{
//    [ApiController]
//    [Route("api/v1/")]
//    public class EventController : ControllerBase
//    {
//        private readonly ILogger<EventController> _logger;
//        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("databaseName.txt"));

//        public EventController(ILogger<EventController> logger)
//        {
//            _logger = logger;
//            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "keys.json");

//            _logger.LogInformation("Connection to Firestore succesful");



//        }


//        //TODO: authentication of events (check for same name and uid)
//        [EnableCors("Policy1")]
//        [HttpPost]
//        [Route("event/add", Name = "add")]
//        public async Task<IActionResult> Add([FromBody] EventAdditionModel model)
//        {
//            _logger.LogInformation($"Event adding Attempt for {model.name}");

//            if (!ModelState.IsValid)
//            {
//                _logger.LogError($"Wrong data model for register attempf for {model.email}");
//                return BadRequest(ModelState);
//            }


//            CollectionReference events = firestoreDb.Collection("event");
//            Dictionary<string, object> data1 = new Dictionary<string, object>()
//            {
//                {"auth_data", model.auth_data },
//                {"description", model.description},
//                {"name", model.name },
//                {"email", model.email },
//                { "add_date", DateTime.Now.ToFileTimeUtc()}
//            };

//            var a = await events.AddAsync(data1);

//            return Ok(JsonConvert.SerializeObject(new { id_event = a.Id }));
//        }

//        [EnableCors("Policy1")]
//        [HttpPost]
//        [Route("event", Name = "getall")]
//        public async Task<IActionResult> GetEvents()
//        {
//            _logger.LogInformation($"Event get Attempt");



//            CollectionReference events = firestoreDb.Collection("event");
//            QuerySnapshot snap = await events.GetSnapshotAsync();
//            Dictionary<string, object> dane = new Dictionary<string, object>();
//            List<Dictionary<string, object>> result = new List<Dictionary<string, object>>();

//            foreach (DocumentSnapshot documentSnapshot in snap.Documents)
//            {
//                Console.WriteLine("Document data for {0} document:", documentSnapshot.Id);
//                dane = documentSnapshot.ToDictionary();

//                Dictionary<string, object> data1 = new Dictionary<string, object>()
//            {
//                {"id_event", documentSnapshot.Id},
//                {"description", dane["description"]},
//                {"name", dane["name"] },
//                {"add_date", dane["add_date"]}
//            };


//                Console.WriteLine();

//                result.Add(data1);


//            }

//            return Ok(JsonConvert.SerializeObject(result));
//        }


//        [EnableCors("Policy1")]
//        [HttpPost]
//        [Route("event/{uid}", Name = "getone")]
//        public async Task<IActionResult> GetEvent(string uid)
//        {
//            _logger.LogInformation($"Event get Attempt");

//            DocumentReference events = firestoreDb.Collection("event").Document(uid);
//            DocumentSnapshot result = await events.GetSnapshotAsync();
//            string data = string.Empty;
//            if (result.Exists)
//            {
//                data = JsonConvert.SerializeObject(new
//                {
//                    name = result.GetValue<string>("name"),
//                    email = result.GetValue<string>("email"),
//                    auth_data = result.GetValue<string>("auth_data"),
//                    description = result.GetValue<string>("description"),
//                    add_date = result.GetValue<string>("add_date"),
//                });
//            }

//            return Ok(data);
//        }
//    }
//}
