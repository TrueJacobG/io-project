using System.ComponentModel.DataAnnotations;

namespace Firestore.Route.Event.Id.DTO
{
    public class PayerGiverDTO
    {
        [Required]
        [EmailAddress]
        public string fromEmail { get; set; }
        [EmailAddress]
        [Required]
        public string toEmail { get; set; }
    }
}
