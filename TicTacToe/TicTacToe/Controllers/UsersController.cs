using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using TicTacToe.Models;

namespace TicTacToe.Controllers
{
    public class UsersController : ApiController
    {
        private GameEntities db = new GameEntities();

        // GET: api/Users
        public IQueryable<User> GetUsers()
        {
            return db.Users;
        }

        // GET: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult GetUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
        // GET: api/Users/username/Points
        [HttpGet]
        [Route("api/Users/{username}/Points")]
        public IHttpActionResult GetPoints(string username)
        {
            User user = db.Users.Where(u => u.UserName == username).FirstOrDefault();
            if (user == null)
            {
                return NotFound();
            }

            return Json(new { status = 1, username = user.UserName, points = user.Points });
        }


        // PUT: api/Users/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUser(int id, User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != user.Id)
            {
                return BadRequest();
            }

            db.Entry(user).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Users
        [ResponseType(typeof(User))]
        public IHttpActionResult PostUser(User user)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Users.Add(user);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = user.Id }, user);
        }

        // DELETE: api/Users/5
        [ResponseType(typeof(User))]
        public IHttpActionResult DeleteUser(int id)
        {
            User user = db.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }

            db.Users.Remove(user);
            db.SaveChanges();

            return Ok(user);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserExists(int id)
        {
            return db.Users.Count(e => e.Id == id) > 0;
        }

        // PATCH: api/Users
        [HttpPatch]
        [Route("api/Users")]
        public IHttpActionResult PatchUser(JObject jdata)
        {
            String username;
            int points ;
            dynamic data = jdata;
            try
            {
                username = data.UserName.ToObject<String>();
                points = (int)data.Points;
            }
            catch (Exception e)
            {
                return BadRequest();
            }
            User user = db.Users.Where(u => u.UserName == username).FirstOrDefault();

            if (user == null)
            {
                return NotFound();
            }
            else
            {
                user.Points = points;
                db.Entry(user).State = EntityState.Modified;
                try
                {
                    db.SaveChanges();
                }
                catch (DbUpdateConcurrencyException e)
                {
                    return Json(new { status = 0, message = e.Message });
                }

            }

            return Json(new { status = 1, username = user.UserName, points = user.Points });
        }
    }
}