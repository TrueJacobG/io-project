using Firebase.Auth;
using FirebaseAdmin.Auth;

namespace Firestore
{
    public class Translator
    {
        public static async Task<string> GetMail(string uid)
        {
            UserRecord userRecord = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            return userRecord.Email;
        }
        public static async Task<string> GetUid(string mail)
        {
            UserRecord userRecord = await FirebaseAdmin.Auth.FirebaseAuth.DefaultInstance.GetUserByEmailAsync(mail);
            return userRecord.Uid;
        }
    }
}
