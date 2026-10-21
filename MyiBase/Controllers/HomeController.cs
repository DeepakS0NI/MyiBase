using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using MyiBase.Models;
using System.Data;
using System.Diagnostics;

namespace MyiBase.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        private readonly IConfiguration _config;

        public readonly string? _connectionString;

        public HomeController(ILogger<HomeController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _connectionString = _config.GetConnectionString("dbcs");
        }

        public IActionResult Index()
        {
         
            return View();
        }

        public IActionResult Login()
        {
            return View();
        }



        public IActionResult SignUp()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
