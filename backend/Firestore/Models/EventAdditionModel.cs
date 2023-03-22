using Google.Cloud.Firestore;
using System.ComponentModel.DataAnnotations;

namespace Firestore.Models
{
    public class EventAdditionModel
    {
        [FirestoreProperty]
        public string auth_data { get; set; }
        [FirestoreProperty]
        public string description { get; set; }
        [FirestoreProperty]
        public string name { get; set; }
        [FirestoreProperty]
        public string email { get; set; }
        [FirestoreProperty]
        public DateTime add_date { get; set; }
    }
}
