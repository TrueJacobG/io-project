using Google.Cloud.Firestore;

namespace Firestore.Models
{
    public class LoginModel
    {
        [FirestoreProperty]
        public string Email { get; set; }

        [FirestoreProperty]
        public string AuthData { get; set; }

    }
}
