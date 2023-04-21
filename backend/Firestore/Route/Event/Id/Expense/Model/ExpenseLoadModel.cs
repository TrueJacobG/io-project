using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace Firestore.Route.Event.Id.Expense.Model
{
    public class ExpenseLoadModel
    {
        [Required]
        public string id_expense { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public string type { get; set; }
        [Required]
        public double cash { get; set; }
        [Required]
        public string author { get; set; }
        [Required]
        public string date { get; set; }
        [Required]
        public string[] users { get; set; }

        public ExpenseLoadModel(string id_expense, string name, string description, string type, double cash, string author, string date, string[] users)
        {
            this.id_expense = id_expense;
            this.name = name;
            this.description = description;
            this.type = type;
            this.cash = cash;
            this.author = author;
            this.date = date;
            this.users = users;
        }
    }
}
