using Firestore.Models;
using Google.Cloud.Firestore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json;
using Firebase.Auth;
using Firebase.Auth.Providers;
using FirebaseAdmin.Auth;
using FirebaseAdmin;

namespace Firestore.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        FirebaseAuthConfig config;
        FirebaseAuthClient client;
        FirebaseApp app;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
            config = new FirebaseAuthConfig
            {
                ApiKey = System.IO.File.ReadAllLines("userConnection.txt")[0],
                AuthDomain = System.IO.File.ReadAllLines("userConnection.txt")[1],
                Providers = new FirebaseAuthProvider[]
                {
                    new EmailProvider()
                }
            };
            client = new FirebaseAuthClient(config);

            if (FirebaseApp.DefaultInstance == null)
            {
                app = FirebaseApp.Create();
            }
        }


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


            GetUsersResult result = await FirebaseAuth.DefaultInstance.GetUsersAsync(
                new List<UserIdentifier>
                {
                    new EmailIdentifier(registrationUser.email),
                });

            if (result.Users.Count() == 0)
            {
                UserRecordArgs args = new UserRecordArgs()
                {
                    Email = registrationUser.email,
                    Password = registrationUser.auth_data,
                    DisplayName = registrationUser.username,
                };

                await client.CreateUserWithEmailAndPasswordAsync(registrationUser.email, registrationUser.auth_data, registrationUser.username);

                return Ok(JsonConvert.SerializeObject(new { }));

            }
            else
            {
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

            GetUsersResult result = await FirebaseAuth.DefaultInstance.GetUsersAsync(
                new List<UserIdentifier>
                {
                    new EmailIdentifier(user.email),
                }
                );

            if (result.Users.Count() == 1)
            {
                await client.SignInWithEmailAndPasswordAsync(user.email, user.auth_data);
                return Ok(JsonConvert.SerializeObject(new { username = result.Users.First().DisplayName }));
            }
            else
            {
                return NotFound("Something is wrong, I can feel it!");
            }
            return StatusCode(403, "Something went really, really wrong");


        }
    }
}