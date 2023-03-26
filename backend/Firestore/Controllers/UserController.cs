using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using Newtonsoft.Json;
using Firestore.Models;
using Firebase.Auth;
using System.Diagnostics;
using Newtonsoft.Json.Linq;

namespace Firestore.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("userConnection.txt")[0]));
        FirestoreDb firestoreDb = FirestoreDb.Create(System.IO.File.ReadAllText("databaseName.txt"));

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("auth/register", Name = "register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registrationModel)
        {
            _logger.LogInformation($"Register Attempt for {registrationModel.email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for register attempf for {registrationModel.email}");
                return BadRequest(ModelState);
            }

            try
            {
                await auth.CreateUserWithEmailAndPasswordAsync(registrationModel.email, registrationModel.auth_data, registrationModel.username);

                var fbAuthLink = await auth.SignInWithEmailAndPasswordAsync(registrationModel.email, registrationModel.auth_data);


                await firestoreDb.Collection("user").Document(fbAuthLink.User.LocalId.ToString()).CreateAsync(new { });

                string token = fbAuthLink.FirebaseToken;

                if (token != null)
                {
                    HttpContext.Session.SetString("_UserToken", token);
                    return Ok(JsonConvert.SerializeObject(new { }));
                }
            }
            catch (FirebaseAuthException ex)
            { 
                return StatusCode(409, JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message);
            }
            return StatusCode(4000);
        }

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("auth/login", Name = "login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            {
                try
                {
                    var fbAuthLink = await auth.SignInWithEmailAndPasswordAsync(loginModel.email, loginModel.auth_data);
                    string token = fbAuthLink.FirebaseToken;

                    if (token != null)
                    {
                        HttpContext.Session.SetString("_UserToken", token);
                        return Ok(JsonConvert.SerializeObject(new { username = fbAuthLink.User.DisplayName }));
                    }
                }
                catch (FirebaseAuthException ex)
                {
                    return StatusCode(404, JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message);
                }
                return StatusCode(4000,"How could this happen to me?");
            }
        }

        [EnableCors("Policy1")]
        [HttpPost]
        [Route("auth/logout", Name = "logout")]
        public async Task<IActionResult> Logout()
        {
            HttpContext.Session.Remove("_UserToken");
            return Ok();
        }
    }
}
