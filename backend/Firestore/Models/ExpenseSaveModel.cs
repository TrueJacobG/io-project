using System.ComponentModel.DataAnnotations;

namespace Firestore.Models
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
    }
}
