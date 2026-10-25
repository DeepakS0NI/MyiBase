using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace MyiBase.Controllers
{
    public class UserController : Controller
    {
        public async Task<IActionResult> Mydashboard()
        {
            using var client = new HttpClient();

            // Browser se aayi authentication cookie
            // Web API ko forward kar rahe hain
            var cookie = Request.Headers["Cookie"].ToString();

            if (!string.IsNullOrEmpty(cookie))
            {
                client.DefaultRequestHeaders.Add("Cookie", cookie);
            }

            // Web API call
            var response = await client.GetAsync(
                "https://localhost:7181/api/auth/me"
            );

            // API ne unauthorized/failed response diya
            if (!response.IsSuccessStatusCode)
            {
                return RedirectToAction("Login", "Home");
            }

            // API response JSON
            var json = await response.Content.ReadAsStringAsync();

            // JSON -> C# object
            var user = JsonSerializer.Deserialize<MeResponse>(
                json,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                }
            );

            // ViewBag ke through View ko data bhejo
            ViewBag.UserData = user;

            return View();
        }
    }

    public class MeResponse
    {
        public int id { get; set; }

        public string? email { get; set; }

        public List<SubdomainResponse>? subdomains { get; set; }
    }

    public class SubdomainResponse
    {
        public int id { get; set; }

        public string? subd { get; set; }
    }
}
