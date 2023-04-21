using System.ComponentModel.DataAnnotations;

namespace Firestore.Event.Expense.DTO
{
    public class ExpenseDeletionModel
    {
        [Required]
        public string id_expense { get; set; }
    }
}
