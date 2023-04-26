using System.ComponentModel.DataAnnotations;

namespace Firestore.Route.Event.Id.Expense.DTO
{
    public class ExpenseDeletionDTO
    {
        [Required]
        public string id_expense { get; set; }
    }
}
