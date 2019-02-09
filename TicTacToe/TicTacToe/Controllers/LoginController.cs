using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TicTacToe.Models;

namespace TicTacToe.Controllers
{
    public class LoginController : ApiController
    {
        private GameEntities db = new GameEntities();

        [HttpPost]
        [Route("api/login")]
        public IHttpActionResult GetUser(JObject jdata)
        {
            String username;
            String password;
            dynamic data = jdata;
            try
            {
                username = data.UserName.ToObject<String>();
                password = data.Password.ToObject<String>();
            }
            catch(Exception)
            {
                return BadRequest();
            }
            User user = db.Users.Where(u => u.UserName == username && u.Password == password).FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }

            return Json( new { username = user.UserName ,points = user.Points});
        }
    }
}
