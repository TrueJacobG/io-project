using System.ComponentModel.DataAnnotations;

namespace Firestore.Event.DTO
{
    public class UserEmailDTO
    {
        [Required]
        [EmailAddress]
        public string user_email { get; set; }
    }
}
