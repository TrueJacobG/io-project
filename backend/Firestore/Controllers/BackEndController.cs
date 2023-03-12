using Firestore.Models;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.SafeHandles;
using System.Runtime.CompilerServices;

namespace Firestore.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BackEndController : ControllerBase
    {
        private readonly ILogger<BackEndController> _logger;

        public BackEndController(ILogger<BackEndController> logger)
        {
            _logger = logger;
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "keys.json");
        }

        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("databaseName.txt"));
        Random random = new Random();


        [HttpPost]
        [Route("auth/register", Name = "Register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registrationUser)
        {
            _logger.LogInformation($"Register Attempt for {registrationUser.Email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for register attempf for {registrationUser.Email}");
                return BadRequest(ModelState);
            }

            CollectionReference users = firestoreDb.Collection("user");
            Query query = users.WhereEqualTo("username", registrationUser.Username).WhereEqualTo("email", registrationUser.Email);

            QuerySnapshot snap = await query.GetSnapshotAsync();

            if (snap.Documents.Count == 0)
            {
                _logger.LogInformation("This email is not registered yet");
                Dictionary<string, object> data1 = new Dictionary<string, object>()
                {
                    {"auth_data",registrationUser.AuthData },
                    {"email",registrationUser.Email },
                    {"username",registrationUser.Username },
                    {"uid", Guid.NewGuid().ToString()},
                };

                await users.AddAsync(data1);
                return Ok();

            }
            else if (snap.Documents.Count >= 0)
            {
                _logger.LogError("This email is already in use!");
                return StatusCode(409, "This email is already in use!");
            }

            return Ok();
        }

        [HttpPost]
        [Route("auth/login", Name = "Login")]
        public async Task<IActionResult> Login([FromBody] LoginModel user)
        {
            _logger.LogInformation($"Login Attempt for {user.Email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for login attempt for {user.Email}");
                return BadRequest(ModelState);
            }

            CollectionReference users = firestoreDb.Collection("user");
            Query query = users.WhereEqualTo("email", user.Email).WhereEqualTo("auth_data", user.AuthData);

            QuerySnapshot snap = await query.GetSnapshotAsync();

            if (snap.Documents.Count == 0)
            {
                _logger.LogError("Something is wrong, I can feel it!");
                return NotFound("Something is wrong, I can feel it!");
            }
            else if (snap.Documents.Count == 1)
            {
                return Ok();
            }
            return Ok();
        }
    }
}