using System.ComponentModel.DataAnnotations;

namespace Firestore.Event.Model
{
    public class EventModel
    {
        [Required]
        public string description { get; set; }
        [Required]
        public string name { get; set; }
    }
}
