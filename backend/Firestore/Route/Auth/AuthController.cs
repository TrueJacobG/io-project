using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Firebase.Auth;
using System.Diagnostics;
using Newtonsoft.Json.Linq;
using Firestore.Firebase;
using Firestore.Route.User.Model;

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

        //TODO::
        //VALIDATION
        //TODO:
        [HttpPost]
        [EnableCors("Policy1")]
        [Route("register", Name = "register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel registrationModel)
        {
            _logger.LogInformation($"Register Attempt for {registrationModel.email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for register attempf for {registrationModel.email}");
                return BadRequest(JsonConvert.SerializeObject(new { message = $"Wrong data model for register attempf for {registrationModel.email}" }));
            }

            try
            {
                await auth.CreateUserWithEmailAndPasswordAsync(registrationModel.email, registrationModel.auth_data, registrationModel.username);

                var fbAuthLink = await auth.SignInWithEmailAndPasswordAsync(registrationModel.email, registrationModel.auth_data);


                string token = fbAuthLink.FirebaseToken;

                if (token != null)
                {
                    return Ok(JsonConvert.SerializeObject(new { token }));
                }
                else
                {
                    return BadRequest(JsonConvert.SerializeObject(new { message = "Token is null" }));
                }
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogError(JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message);
                return StatusCode(400, JsonConvert.SerializeObject(new { message = JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message }));
            }
        }

        //TODO::
        //VALIDATION
        //TODO:
        [HttpPost]
        [EnableCors("Policy1")]
        [Route("login", Name = "login")]
        public async Task<IActionResult> Login([FromBody] LoginModel loginModel)
        {
            _logger.LogInformation($"Login attempt for {loginModel.email}");

            if (!ModelState.IsValid)
            {
                _logger.LogError($"Wrong data model for register attempf for {loginModel.email}");
                return BadRequest(JsonConvert.SerializeObject(new { message = $"Wrong data model for register attempf for {loginModel.email}" }));
            }

            try
            {
                var fbAuthLink = await auth.SignInWithEmailAndPasswordAsync(loginModel.email, loginModel.auth_data);
                string token = fbAuthLink.FirebaseToken;

                if (token != null)
                {
                    return Ok(JsonConvert.SerializeObject(new { token, username = fbAuthLink.User.DisplayName }));
                }
                else
                {
                    return BadRequest(JsonConvert.SerializeObject(new { message = "Token is null" }));
                }
            }
            catch (FirebaseAuthException ex)
            {
                _logger.LogError(JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message);
                return StatusCode(404, JsonConvert.SerializeObject(new { message = JsonConvert.DeserializeObject<FirebaseError>(ex.ResponseData).error.message }));
            }
        }
    }
}
