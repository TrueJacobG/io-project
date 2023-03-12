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
        public string username { get; set; }

        [FirestoreProperty]
        public string email { get; set; }

        [FirestoreProperty]
        public string auth_data { get; set; }
    }
}
