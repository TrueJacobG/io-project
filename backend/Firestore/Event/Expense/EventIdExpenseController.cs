using Firebase.Auth;
using Firestore.Event.Expense.DTO;
using Firestore.Event.Expense.Model;
using Firestore.Firebase;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Firestore.Event.Expense
{
    [ApiController]
    [Route("api/v1/")]
    public class EventIdExpenseController : Controller
    {
        private readonly ILogger<EventController> _logger;
        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("Config/userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("Config/databaseName.txt"));

        private readonly string eventCollection = "event";
        private readonly string expenseCollection = "expense";


        public EventIdExpenseController(ILogger<EventController> logger)
        {
            _logger = logger;
        }

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

                    List<string> users = new List<string>();

                    foreach (Dictionary<string, string> userData in expenseData.GetValue<Dictionary<string, string>[]>("users"))
                    {
                        users.Add(userData["email"]);
                    }



                    ExpenseLoadModel model = new ExpenseLoadModel(expenseData.Id, expenseData.GetValue<string>("name"), expenseData.GetValue<string>("description"),
                       expenseData.GetValue<string>("type"), expenseData.GetValue<double>("cash"), await Translator.GetMail(expenseData.GetValue<string>("creator")),
                       expenseData.GetValue<Timestamp>("add_date").ToDateTime().ToString(), users.ToArray());

                    data.Add(model);
                }
            }
            return Ok(JsonConvert.SerializeObject(new { expenses = data }));
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

            foreach (Dictionary<string, string> item in model.users)
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

            return Ok(JsonConvert.SerializeObject(new { id_expense = a.Id, author = user.Email, date = time.ToDateTime().ToString() }));
        }

        [EnableCors("Policy1")]
        [HttpDelete]
        [Route("event/{id_event}/expense", Name = "deleteExpense")]
        public async Task<IActionResult> DeleteExpense(string id_event, [FromBody] ExpenseDeletionModel model)
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
