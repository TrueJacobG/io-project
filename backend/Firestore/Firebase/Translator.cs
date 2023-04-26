using Firebase.Auth;
using FirebaseAdmin.Auth;

namespace Firestore.Firebase
{
    public class Translator
    {
        public static async Task<string> GetMailByUID(string uid)
        {
            Console.WriteLine($"GetMailByUID:::{uid}");
            UserRecord userRecord = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            return userRecord.Email;
        }

        public static async Task<string> GetUsernameByUID(string uid)
        {
            Console.WriteLine($"GetUsernameByUID:::{uid}");
            UserRecord userRecord = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            return userRecord.DisplayName;
        }

        public static async Task<string> GetUsernameByEmail(string email)
        {
            Console.WriteLine($"GetUsernameByEmail:::{email}");
            if (email == null)
            {
                return string.Empty;
            }
            string uid = await GetUidByEmail(email);

            string username = await GetUsernameByUID(uid);

            return username;

        }
        public static async Task<string> GetUidByEmail(string email)
        {
            Console.WriteLine($"GetUidByEmail:::{email}");
            UserRecord userRecord;
            try
            {
                userRecord = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.GetUserByEmailAsync(email);
                Console.WriteLine("Succesfully got uid");
            }
            catch (Exception)
            {
                return string.Empty;

            }
            return userRecord.Uid;
        }
    }
}
