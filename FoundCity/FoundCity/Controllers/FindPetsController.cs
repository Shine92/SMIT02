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
using FoundCity.Models;

namespace FoundCity.Controllers
{
    public class FindPetsController : ApiController
    {
        private NewPetEntities db = new NewPetEntities();

        public List<FindPet> GetFindPets(string species, string size, string sex, string age, string hairColor, string lostPlace1, string lostPlace2, string lostPlace3) {
            //List<FindPet> products = new List<FindPet>();

            var query = from o in db.FindPets
                        orderby o.PetId descending
                        //where o.Species == species && (o.Size == size && (o.Sex == sex && (o.Age == age && o.HairColor == hairColor)))
                        where ((species == "all") ? true : o.Species == species)
                        && ((size == "all") ? true : o.Size == size)
                        && ((sex == "all") ? true : o.Sex == sex)
                        && ((age == "all") ? (true) : (o.Age == age))
                        && ((hairColor == "all") ? (true) : (o.HairColor == hairColor))
                        && ((lostPlace1 == "all1") ? (true) : (o.LostPlace1 == lostPlace1))
                        && ((lostPlace2 == "全部") ? (true) : (o.LostPlace2 == lostPlace2))
                        && ((lostPlace3 == "all3") ? (true) : (o.LostPlace3 == lostPlace3))
                        select o;

            var viewData = query.ToList();
            return viewData;


        }


        //不含區域搜尋
        //http://localhost:51664/api/FindPets?species=貓&size=中型&sex=母&hairColor=白色&age=成年
        public List<FindPet> GetFindPets(string species, string size, string sex, string age, string hairColor) {
            //List<FindPet> products = new List<FindPet>();

            var query = from o in db.FindPets
                        orderby o.PetId descending
                        //where o.Species == species && (o.Size == size && (o.Sex == sex && (o.Age == age && o.HairColor == hairColor)))
                        where ((species == "all") ? true : o.Species == species)
                        && ((size == "all") ? true : o.Size == size)
                        && ((sex == "all") ? true : o.Sex == sex)
                        && ((age == "all") ? (true) : (o.Age == age))
                        && ((hairColor == "all") ? (true) : (o.HairColor == hairColor))
                        select o;

            var viewData = query.ToList();
            return viewData;

            //hint: sql寫法
            //var sql = "select* from user where 1 = 1";
            //var s = "(o.Species == species)";

            //var query = from o in db.FindPets
            //            orderby o.PetId descending
            //            where ((species == "all")? true : o.Species == species) 
            //            && ((size == "all") ? true : o.Size == size)
            //            && ((sex == "all") ? true : o.Sex == sex) 
            //            && ((age == "all") ? true : o.Age == age) 
            //            && ((hairColor == "all") ? true : o.HairColor == hairColor)
            //            select o;

            //var viewData = query.ToList();
            //return viewData;
        }

        // GET: api/FindPets
        //public IQueryable<FindPet> GetFindPets()
        //{
        //    return db.FindPets;
        //}
        public List<FindPet> GetFindPets() {
            var query = from o in db.FindPets
                        orderby o.PetId descending
                        select o;

            var viewData = query.ToList();
            return viewData;
        }

        // GET: api/FindPets/5
        [ResponseType(typeof(FindPet))]
        public IHttpActionResult GetFindPet(int id) {
            FindPet findPet = db.FindPets.Find(id);
            if (findPet == null) {
                return NotFound();
            }

            return Ok(findPet);
        }
        //public FindPet Get(int id)
        //{
        //    //List<FindPet> products = new List<FindPet>();
        //    var query = from o in db.FindPets
        //                orderby o.PetId descending
        //                select o;

        //    var viewData = query.ToList();
        //    return viewData.Find(p => p.PetId == id);
        //}

        // PUT: api/FindPets/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutFindPet(int id, FindPet findPet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != findPet.PetId)
            {
                return BadRequest();
            }

            db.Entry(findPet).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FindPetExists(id))
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

        // POST: api/FindPets
        [ResponseType(typeof(FindPet))]
        public IHttpActionResult PostFindPet(FindPet findPet)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.FindPets.Add(findPet);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = findPet.PetId }, findPet);
        }

        // DELETE: api/FindPets/5
        [ResponseType(typeof(FindPet))]
        public IHttpActionResult DeleteFindPet(int id)
        {
            FindPet findPet = db.FindPets.Find(id);
            if (findPet == null)
            {
                return NotFound();
            }

            db.FindPets.Remove(findPet);
            db.SaveChanges();

            return Ok(findPet);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FindPetExists(int id)
        {
            return db.FindPets.Count(e => e.PetId == id) > 0;
        }
    }
}