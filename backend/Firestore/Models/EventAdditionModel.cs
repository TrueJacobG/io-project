using System.ComponentModel.DataAnnotations;

namespace Firestore.Models
{
    public class EventAdditionModel
    {
        public string auth_data { get; set; }
        public string description { get; set; }
        public string name { get; set; }
        public string email { get; set; }
        public DateTime add_date { get; set; }
    }
}
