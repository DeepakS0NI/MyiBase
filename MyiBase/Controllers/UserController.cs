using Microsoft.AspNetCore.Mvc;

namespace MyiBase.Controllers
{
    public class UserController: Controller
    {
        public IActionResult MyDashboard()
        {
            return View();
        }
    }
}
