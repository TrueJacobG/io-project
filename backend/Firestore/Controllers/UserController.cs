using Microsoft.AspNetCore.Mvc;
using Firebase.Auth;
using System.Diagnostics;
using Firestore.Models;
using Microsoft.AspNetCore.Cors;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Firestore.Controllers
{
    [ApiController]
    [Route("api/v1/")]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;

        //FirebaseAuthConfig config;
        //FirebaseAuthClient client;

        FirebaseAuthProvider auth;

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;

            auth = new FirebaseAuthProvider(new FirebaseConfig(System.IO.File.ReadAllLines("userConnection.txt")[0]));
            //config = new FirebaseAuthConfig
            //{
            //    ApiKey = System.IO.File.ReadAllLines("userConnection.txt")[0],
            //    AuthDomain = System.IO.File.ReadAllLines("userConnection.txt")[1],
            //    Providers = new FirebaseAuthProvider[]
            //    {
            //        new EmailProvider()
            //    }
            //};
            //client = new FirebaseAuthClient(config);

        }

        [HttpPost]
        [EnableCors("Policy1")]
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

                string token = fbAuthLink.FirebaseToken;

                if(token != null)
                {
                    HttpContext.Session.SetString("_UserToken", token);
                    return Ok();
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
                return StatusCode(4000);
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

        [EnableCors("Policy1")]
        [HttpGet]
        [Route("auth/uid", Name = "getuid")]
        public async Task<IActionResult> getuid(string token)
        {
            //GETTING UID
            var a = await auth.GetUserAsync(token);
            return Ok(JsonConvert.SerializeObject(new { uid = a.LocalId }));
        }



        //[EnableCors("Policy1")]
        //[HttpPost]
        //[Route("auth/register", Name = "register")]
        //public async Task<IActionResult> Register([FromBody] RegistrationModel registrationUser)
        //{

        //    _logger.LogInformation($"Register Attempt for {registrationUser.email}");

        //    if (!ModelState.IsValid)
        //    {
        //        _logger.LogError($"Wrong data model for register attempf for {registrationUser.email}");
        //        return BadRequest(ModelState);
        //    }


        //    GetUsersResult result = await FirebaseAuth.DefaultInstance.GetUsersAsync(
        //        new List<UserIdentifier>
        //        {
        //            new EmailIdentifier(registrationUser.email),
        //        });

        //    if (result.Users.Count() == 0)
        //    {
        //        UserRecordArgs args = new UserRecordArgs()
        //        {
        //            Email = registrationUser.email,
        //            Password = registrationUser.auth_data,
        //            DisplayName = registrationUser.username,
        //        };

        //        await client.CreateUserWithEmailAndPasswordAsync(registrationUser.email, registrationUser.auth_data, registrationUser.username);

        //        return Ok(JsonConvert.SerializeObject(new { }));

        //    }
        //    else
        //    {
        //        return StatusCode(409, "This email is already in use!");
        //    }

        //    return StatusCode(550);

        //}


        //[EnableCors("Policy1")]
        //[HttpPost]
        //[Route("auth/login", Name = "login")]
        //public async Task<IActionResult> Login([FromBody] LoginModel user)
        //{

        //    _logger.LogInformation($"Login Attempt for {user.email}");

        //    if (!ModelState.IsValid)
        //    {
        //        _logger.LogError($"Wrong data model for login attempt for {user.email}");
        //        return BadRequest(ModelState);
        //    }

        //    GetUsersResult result = await FirebaseAuth.DefaultInstance.GetUsersAsync(
        //        new List<UserIdentifier>
        //        {
        //            new EmailIdentifier(user.email),
        //        }
        //        );

        //    if (result.Users.Count() == 1)
        //    {
        //        await client.SignInWithEmailAndPasswordAsync(user.email, user.auth_data);
        //        return Ok(JsonConvert.SerializeObject(new { username = result.Users.First().DisplayName }));
        //    }
        //    else
        //    {
        //        return NotFound("Something is wrong, I can feel it!");
        //    }
        //    return StatusCode(403, "Something went really, really wrong");


    }
}
