using System.ComponentModel.DataAnnotations;

namespace Firestore.User.Model
{
    /// <summary>
    /// Represents a user that will be stored in firestore.
    /// </summary>
    public class RegistrationModel
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

        [Required]
        [MinLength(3, ErrorMessage = "Username is too short")]
        [MaxLength(50, ErrorMessage = "Username is too long")]
        public string username { get; set; }

    }
}
