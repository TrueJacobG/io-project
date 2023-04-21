using Microsoft.AspNetCore.Mvc;

namespace Firestore.Event.User
{
    public class EventIdUserController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
