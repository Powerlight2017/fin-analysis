using FinAnalysisBackend.Entities;
using FinAnalysisBackend.Utilities;
using Newtonsoft.Json;
using System.Security.Cryptography;
using System.Text;

namespace FinAnalysisBackend.Services
{
    public class UsersService
    {
        private static readonly object FileLock = new object();

        private static string DataFilePath
        {
            get
            {
                return System.IO.Path.Combine(Constants.DataDirectory, Constants.UsersFile);
            }
        }

        public User GetById(int Id)
        {
            return GetUsers().FirstOrDefault(x => x.Id == Id);
        }

        public User GetByUserName(string userName)
        {
            return GetUsers().FirstOrDefault(x => x.Username == userName);
        }

        public User CreateOrUpdate(User user)
        {
            lock (FileLock)
            {
                User[] users = GetUsers();

                if (user.Id == 0)
                {
                    user.Id = GetLastId(users);
                    Array.Resize(ref users, users.Length + 1);
                    users[users.Length - 1] = user;
                }
                else
                {
                    for (int i = 0; i < users.Length; i++)
                    {
                        if (users[i].Id == user.Id)
                        {
                            users[i] = user;
                        }
                    }
                }

                string updatedData = JsonConvert.SerializeObject(users);
                System.IO.File.WriteAllText(DataFilePath, updatedData);
                return user;
            }
        }

        private static User[] GetUsers()
        {
            lock (FileLock)
            {
                string data = System.IO.File.ReadAllText(DataFilePath);
                User[] users = JsonConvert.DeserializeObject<User[]>(data);
                return users;
            }
        }

        private int GetLastId(IEnumerable<User> users)
        {
            return users.Count() > 0 ? users.Max(r => r.Id) + 1 : 1;
        }

        internal User Register(string userName, string password)
        {

            lock (FileLock)
            {
                List<User> users = GetUsers().ToList();

                using var hmac = new HMACSHA512();
                User user = new User
                {
                    Username = userName,
                    PasswordHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password))),
                    PasswordSalt = Convert.ToBase64String(hmac.Key),
                };

                user = CreateOrUpdate(user);

                return user;
            }
        }
    }
}
