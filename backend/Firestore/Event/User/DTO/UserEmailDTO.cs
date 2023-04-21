using System.ComponentModel.DataAnnotations;

namespace Firestore.Event.User.DTO
{
    public class UserEmailDTO
    {
        [Required]
        [EmailAddress]
        public string user_email { get; set; }
    }
}
