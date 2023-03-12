using Google.Cloud.Firestore;

namespace Firestore.Models
{
    /// <summary>
    /// Represents a user that will be stored in firestore.
    /// </summary>
    [FirestoreData]
    public class RegistrationModel
    {
        [FirestoreProperty]
        public string Username { get; set; }

        [FirestoreProperty]
        public string Email { get; set; }

        [FirestoreProperty]
        public string AuthData { get; set; }
    }
}
