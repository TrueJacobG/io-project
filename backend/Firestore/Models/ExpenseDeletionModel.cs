using System.ComponentModel.DataAnnotations;

namespace Firestore.Models
{
    public class ExpenseDeletionModel
    {
        [Required]
        public string id_expense { get;set;}
    }
}
