using Microsoft.AspNetCore.SignalR;

namespace SignalR.Server
{
    public class Chat : Hub
    {
        public void NewMessage(string userName, string message)
        {
            var date = DateTime.Now.ToString("HH:mm");
            Clients.All.SendAsync("newMessage", userName, message, date);
        }

        public void NewUser(string userName)
        {
            Clients.All.SendAsync("newUser", userName);
        }
    }
}
