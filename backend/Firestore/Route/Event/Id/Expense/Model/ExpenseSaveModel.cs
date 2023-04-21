using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace Firestore.Route.Event.Id.Expense.Model
{
    public class ExpenseSaveModel
    {
        [Required]
        public string name { get; set; }
        [Required]
        public string description { get; set; }
        [Required]
        public string type { get; set; }
        [Required]
        public double cash { get; set; }
        [Required]
        public Dictionary<string, string>[] users { get; set; }
    }
}
