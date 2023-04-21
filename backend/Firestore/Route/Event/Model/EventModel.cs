using System.ComponentModel.DataAnnotations;

namespace Firestore.Route.Event.Model
{
    public class EventModel
    {
        [Required]
        public string description { get; set; }
        [Required]
        public string name { get; set; }
    }
}
