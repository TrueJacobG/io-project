using System.ComponentModel.DataAnnotations;

namespace Firestore.Route.Event.Id.User.DTO
{
    public class UserEmailDTO
    {
        [Required]
        [EmailAddress]
        public string user_email { get; set; }
    }
}
