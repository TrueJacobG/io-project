using Microsoft.AspNetCore.Mvc;

namespace Firestore.Event.Expense
{
    public class EventIdExpenseController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
