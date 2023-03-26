using System.ComponentModel.DataAnnotations;

namespace Firestore.Models
{
    public class LoginModel
    {
        [Required]
        [MinLength(6, ErrorMessage = "Password is too short")]
        [MaxLength(100, ErrorMessage = "Password is too long")]
        public string auth_data { get; set; }

        [Required]
        [MinLength(5, ErrorMessage = "Email is too short")]
        [MaxLength(100, ErrorMessage = "Email is too long")]
        [EmailAddress]
        public string email { get; set; }
    }
}
