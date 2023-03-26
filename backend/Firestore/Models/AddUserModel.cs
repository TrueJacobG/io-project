using System.ComponentModel.DataAnnotations;

namespace Firestore.Models
{
    public class UserInEventModel
    {
        [Required]
        [EmailAddress]
        public string user_email { get; set; }
    }
}
