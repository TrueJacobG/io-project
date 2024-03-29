using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Firebase.Auth;
using System.Diagnostics;
using Newtonsoft.Json.Linq;
using Firestore.FirebaseThings;
using Firestore.Route.User.Model;
using FirebaseAdmin.Auth;
using Firestore.Route.Auth.DTO;

namespace Firestore.Route.User
{
    [ApiController]
    [Route("api/v1/auth/")]
    public class AuthController : ControllerBase
    {
        private readonly ILogger<AuthController> _logger;

        FirebaseAuthProvider auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("Config/userConnection.txt")[0]));

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [EnableCors("Policy1")]
        [Route("register", Name = "register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registrationModel)
        {
            _logger.LogInformation($"Register Attempt for {registrationModel.email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong debtors model for register attempf for {registrationModel.email}");
                return StatusCode(400, JsonConvert.SerializeObject(new { message = $"Wrong debtors model for register attempf for {registrationModel.email}" }));
            }

            try
            {
                await Translator.GetUidByEmail(registrationModel.email);
            }
            catch (Exception)
            {
                return StatusCode(409, JsonConvert.SerializeObject(new { message = "Email is already used" }));
            }
            try
            {
                await auth.CreateUserWithEmailAndPasswordAsync(registrationModel.email, registrationModel.auth_data, registrationModel.username);

                FirebaseAuthLink fbAuthLink = await auth.SignInWithEmailAndPasswordAsync(registrationModel.email, registrationModel.auth_data);


                string token = fbAuthLink.FirebaseToken;

                if (token != null)
                {
                    return StatusCode(200, JsonConvert.SerializeObject(new { token = token }));
                }
                else
                {
                    return StatusCode(400, JsonConvert.SerializeObject(new { message = "Token is null" }));
                }
            }
            catch (Firebase.Auth.FirebaseAuthException ex)
            {
                _logger.LogError(JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message);
                return StatusCode(400, JsonConvert.SerializeObject(new { message = JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message }));
            }
        }

        [HttpPost]
        [EnableCors("Policy1")]
        [Route("login", Name = "login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            _logger.LogInformation($"Login attempt for {loginModel.email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong debtors model for register attempf for {loginModel.email}");
                return StatusCode(400, JsonConvert.SerializeObject(new { message = $"Wrong debtors model for register attempf for {loginModel.email}" }));
            }

            try
            {
                var fbAuthLink = await auth.SignInWithEmailAndPasswordAsync(loginModel.email, loginModel.auth_data);
                string token = fbAuthLink.FirebaseToken;

                if (token != null)
                {
                    return StatusCode(200, JsonConvert.SerializeObject(new { token = token, username = fbAuthLink.User.DisplayName, email = fbAuthLink.User.Email }));
                }
                else
                {
                    return StatusCode(400, JsonConvert.SerializeObject(new { message = "Token is null" }));
                }
            }
            catch (Firebase.Auth.FirebaseAuthException ex)
            {
                _logger.LogError(JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message);
                return StatusCode(404, JsonConvert.SerializeObject(new { message = JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message }));
            }
        }


        [HttpPost]
        [EnableCors("Policy1")]
        [Route("validate", Name = "validate")]
        public async Task<IActionResult> Validate()
        {
            try
            {
                var user = auth.GetUserAsync(Request.Headers["authorization"]).Result;
                return StatusCode(200, JsonConvert.SerializeObject(new { }));
            }
            catch (Exception)
            {
                return StatusCode(404, JsonConvert.SerializeObject(new { message = "Token expired" }));
            }
        }
    }
}
