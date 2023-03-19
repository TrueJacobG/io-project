using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace Firestore.Models
{
    /// <summary>
    /// Represents a user that will be stored in firestore.
    /// </summary>
    [FirestoreData]
    public class RegistrationModel
    {
        [FirestoreProperty]
        [MinLength(6, ErrorMessage = "Password is too short")]
        [MaxLength(100, ErrorMessage = "Password is too long")]
        public string auth_data { get; set; }

        [FirestoreProperty]
        [MinLength(5, ErrorMessage = "Email is too short")]
        [MaxLength(100, ErrorMessage = "Email is too long")]
        public string email { get; set; }

        [FirestoreProperty]
        [MinLength(3, ErrorMessage = "Username is too short")]
        [MaxLength(50, ErrorMessage = "Username is too long")]
        public string username { get; set; }

    }
}
