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

        private readonly string eventCollection = "event";
        private readonly string expenseCollection = "expense";


        public EventController(ILogger<EventController> logger)
        {
            _logger = logger;
        }




        #region event
        [EnableCors("Policy1")]
        [HttpGet]
        [Route("event", Name = "getEvents")]
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
        [Route("event", Name = "addEvent")]
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
                    users = users,
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


        #region event/{id_event}/user

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("event/{id_event}/user", Name = "addUser")]
        public async Task<IActionResult> AddUser([FromBody] UserInEventModel userModel, string id_event)
        {
            _logger.LogInformation($"Attempt for adding user {userModel.user_email} in event {id_event}");
            
            string uid = await Translator.GetUid(userModel.user_email);

            if(uid == string.Empty)
            {
                return BadRequest(JsonConvert.SerializeObject(new { message = "There is no user with that email"}));
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
        public async Task<IActionResult> DeleteUser([FromBody] UserInEventModel userModel, string id_event)
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
        #endregion event/{uid}/user


        #region event/{id_event}/expense
        [EnableCors("Policy1")]
        [HttpGet]
        [Route("event/{id_event}/expense", Name = "getExpenses")]
        public async Task<IActionResult> GetExpenses(string id_event)
        {

            DocumentReference eventReference = firestoreDb.Collection(eventCollection).Document(id_event);
            DocumentSnapshot eventData = await eventReference.GetSnapshotAsync();

            //expense[] -> {id_expense, name, description, type, cost, author, date}[]
            List<ExpenseLoadModel> data = new List<ExpenseLoadModel>();

            if (eventData.Exists)
            {

                foreach (string item in eventData.GetValue<string[]>("expenses"))
                {
                    DocumentSnapshot expenseData = await firestoreDb.Collection(expenseCollection).Document(item).GetSnapshotAsync();

                    ExpenseLoadModel model = new ExpenseLoadModel(expenseData.Id, expenseData.GetValue<string>("name"), expenseData.GetValue<string>("description"),
                       expenseData.GetValue<string>("type"), expenseData.GetValue<double>("cash"), await Translator.GetMail(expenseData.GetValue<string>("creator")),
                       expenseData.GetValue<Timestamp>("add_date").ToDateTime().ToString(), expenseData.GetValue<Dictionary<string, string>[]>("users"));

                    data.Add(model);
                }
            }
            return Ok(JsonConvert.SerializeObject(new {expenses = data}));
        }

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("event/{id_event}/expense", Name = "addExpense")]
        public async Task<IActionResult> AddExpense(string id_event, [FromBody] ExpenseSaveModel model)
        {
            
            DocumentReference eventToUpdate = firestoreDb.Collection(eventCollection).Document(id_event);

            var user = auth.GetUserAsync(Request.Headers["authorization"]).Result;

            CollectionReference expense = firestoreDb.Collection(expenseCollection);
            Timestamp time = Timestamp.GetCurrentTimestamp();

            Dictionary<string, object> data1 = new Dictionary<string, object>()
            {
                {"creator", user.LocalId},
                {"description", model.description},
                {"name", model.name},
                {"type", model.type},
                {"cash", model.cash },
                {"add_date", time},
            };

            foreach (Dictionary<string,string> item in model.users)
            {
                Console.WriteLine(item["email"]);
                Console.WriteLine(item["value"]);
            }

            data1.Add("users", model.users);

            var a = await expense.AddAsync(data1);

            DocumentSnapshot snapshot = await eventToUpdate.GetSnapshotAsync();
            List<string> expenses = new List<string>();
            if (snapshot.Exists)
            {
                expenses = snapshot.GetValue<List<string>>("expenses");
            }
            expenses.Add(a.Id);

            Dictionary<string, object> updates = new Dictionary<string, object>
            {
                { "expenses", expenses }
            };
            await eventToUpdate.UpdateAsync(updates);

            return Ok(JsonConvert.SerializeObject(new {id_expense = a.Id, author = user.Email, date = time.ToDateTime().ToString() }));
        }

        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("event/{id_event}/expense", Name = "deleteExpense")]
        public async Task<IActionResult> DeleteExpense(string id_event,[FromBody] ExpenseDeletionModel model)
        {
            _logger.LogInformation($"Attempt for deleting expense {model} in event {id_event}");

            DocumentReference events = firestoreDb.Collection(eventCollection).Document(id_event);

            DocumentSnapshot snapshot = await events.GetSnapshotAsync();
            List<string> expenses = new List<string>();
            if (snapshot.Exists)
            {
                expenses = snapshot.GetValue<List<string>>(expenseCollection);
            }
            expenses.Remove(model.id_expense);

            Dictionary<string, object> updates = new Dictionary<string, object>
            {
                { "expenses", expenses }
            };

            await events.UpdateAsync(updates);
            await firestoreDb.Collection("expenses").Document(model.id_expense).DeleteAsync();

            return Ok(JsonConvert.SerializeObject(new { }));
        }

        #endregion event/{id_event}/expense
    }
}