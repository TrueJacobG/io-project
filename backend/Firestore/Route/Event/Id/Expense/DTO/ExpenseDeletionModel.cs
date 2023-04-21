using System.ComponentModel.DataAnnotations;

namespace Firestore.Route.Event.Id.Expense.DTO
{
    public class ExpenseDeletionModel
    {
        [Required]
        public string id_expense { get; set; }
    }
}
