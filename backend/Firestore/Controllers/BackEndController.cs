using Firestore.Models;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32.SafeHandles;
using System.Runtime.CompilerServices;
//using System.Web.Http.Cors;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json;
using System.Reflection.Metadata.Ecma335;
using FirebaseAdmin.Auth;
using Google.Apis.Auth.OAuth2;
using FirebaseAdmin;

namespace Firestore.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    //[EnableCors("http://localhost:5173/", "*", "*")]
    public class BackEndController : ControllerBase
    {
        private readonly ILogger<BackEndController> _logger;

        public BackEndController(ILogger<BackEndController> logger)
        {
            _logger = logger;
            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "keys.json");
        }

        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("databaseName.txt"));
        FirebaseApp app = FirebaseApp.Create();






        [EnableCors("Policy1")]
        [HttpPost]
        [Route("auth/register", Name = "register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registrationUser)
        {
            _logger.LogInformation($"Register Attempt for {registrationUser.email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for register attempf for {registrationUser.email}");
                return BadRequest(ModelState);
            }



            UserRecordArgs args = new UserRecordArgs()
            {
                Email = "user@example.com",
                Password = "secretPassword",
                DisplayName = "John Doe",
            };
            UserRecord userRecord = await FirebaseAuth.DefaultInstance.CreateUserAsync(args);


            CollectionReference users = firestoreDb.Collection("user");
            Query query = users.WhereEqualTo("username", registrationUser.username).WhereEqualTo("email", registrationUser.email);

            QuerySnapshot snap = await query.GetSnapshotAsync();

            if (snap.Documents.Count == 0)
            {
                _logger.LogInformation("This email is not registered yet");
                Dictionary<string, object> data1 = new Dictionary<string, object>()
                {
                    {"auth_data",registrationUser.auth_data },
                    {"email",registrationUser.email },
                    {"username",registrationUser.username },
                };

                await users.AddAsync(data1);
                return Ok(JsonConvert.SerializeObject(new { }));

            }
            else if (snap.Documents.Count >= 0)
            {
                _logger.LogError("This email is already in use!");
                return StatusCode(409, "This email is already in use!");
            }

            return StatusCode(550);
        }







        [EnableCors("Policy1")]
        [HttpPost]
        [Route("auth/login", Name = "login")]
        public async Task<IActionResult> Login([FromBody] LoginModel user)
        {

            _logger.LogInformation($"Login Attempt for {user.email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for login attempt for {user.email}");
                return BadRequest(ModelState);
            }

            CollectionReference users = firestoreDb.Collection("user");
            Query query = users.WhereEqualTo("email", user.email).WhereEqualTo("auth_data", user.auth_data);

            QuerySnapshot snap = await query.GetSnapshotAsync();

            if (snap.Documents.Count == 0)
            {
                _logger.LogError("Something is wrong, I can feel it!");
                return NotFound("Something is wrong, I can feel it!");
            }
            else if (snap.Documents.Count == 1)
            {
                string snapUsername = snap.Documents[0].ConvertTo<RegistrationModel>().username;
                return Ok(JsonConvert.SerializeObject(new { username = snapUsername }));
            }
            return StatusCode(550);
        }
    }
}