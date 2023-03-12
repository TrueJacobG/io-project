using Google.Cloud.Firestore;

namespace Firestore.Models
{
    public class LoginModel
    {
        [FirestoreProperty]
        public string auth_data { get; set; }

        [FirestoreProperty]
        public string email { get; set; }



    }
}
