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
    public class FindMomsController : ApiController
    {

        private NewPetEntities db = new NewPetEntities();

        //一個月前的時間
        string dueDate = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd");

        public List<FindMom> GetFindPets(string species, string size, string sex, string age, string hairColor, string findPlace1, string findPlace2, string findPlace3) {
            //List<FindPet> products = new List<FindPet>();

            //只顯示一個月內的資料,且狀態:未凍結 (dueDate:1個月前)
            var query = from o in db.FindMoms
                        orderby o.PetId descending
                        //where o.Species == species && (o.Size == size && (o.Sex == sex && (o.Age == age && o.HairColor == hairColor)))
                        where ((species == "all") ? true : o.Species == species)
                        && ((size == "all") ? true : o.Size == size)
                        && ((sex == "all") ? true : o.Sex == sex)
                        && ((age == "all") ? (true) : (o.Age == age))
                        && ((hairColor == "all") ? (true) : (o.HairColor == hairColor))
                        && ((findPlace1 == "all1") ? (true) : (o.FindPlace1 == findPlace1))
                        && ((findPlace2 == "全部") ? (true) : (o.FindPlace2 == findPlace2))
                        && ((findPlace3 == "全部") ? (true) : (o.FindPlace3 == findPlace3))
                        && (o.State == 1)
                        && (string.Compare(dueDate, o.CreateDate) < 0)
                        select o;

            var viewData = query.ToList();
            return viewData;


        }


        //不含區域搜尋
        //http://localhost:51664/api/FindPets?species=貓&size=中型&sex=母&hairColor=白色&age=成年
        public List<FindMom> GetFindPets(string species, string size, string sex, string age, string hairColor) {
            //List<FindPet> products = new List<FindPet>();
            //只顯示一個月內的資料,且狀態:未凍結 (dueDate:1個月前)

            var query = from o in db.FindMoms
                        orderby o.PetId descending
                        //where o.Species == species && (o.Size == size && (o.Sex == sex && (o.Age == age && o.HairColor == hairColor)))
                        where ((species == "all") ? true : o.Species == species)
                        && ((size == "all") ? true : o.Size == size)
                        && ((sex == "all") ? true : o.Sex == sex)
                        && ((age == "all") ? (true) : (o.Age == age))
                        && ((hairColor == "all") ? (true) : (o.HairColor == hairColor))
                        && (o.State == 1)
                        && (string.Compare(dueDate, o.CreateDate) < 0)
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

        // GET: api/FindMoms
        //public IQueryable<FindMom> GetFindMoms()
        //{
        //    return db.FindMoms;
        //}
        public List<FindMom> GetFindPets() {
            //只顯示一個月內的資料,且狀態:未凍結 (dueDate:1個月前)
            var query = from o in db.FindMoms
                        orderby o.PetId descending
                        where (o.State == 1) && (string.Compare(dueDate, o.CreateDate) < 0)
                        select o;

            var viewData = query.ToList();
            return viewData;
        }

        // GET: api/FindMoms/5
        [ResponseType(typeof(FindMom))]
        public IHttpActionResult GetFindMom(int id)
        {
            FindMom findMom = db.FindMoms.Find(id);
            if (findMom == null)
            {
                return NotFound();
            }

            return Ok(findMom);
        }
        //public FindMom Get(int id)
        //{
        //    //List<FindMom> products = new List<FindMom>();
        //    var query = from o in db.FindMoms
        //                orderby o.PetId descending
        //                select o;

        //    var viewData = query.ToList();
        //    return viewData.Find(p => p.PetId == id);
        //}

        // PUT: api/FindMoms/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutFindMom(int id, FindMom findMom)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != findMom.PetId)
            {
                return BadRequest();
            }

            db.Entry(findMom).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FindMomExists(id))
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

        // POST: api/FindMoms
        [ResponseType(typeof(FindMom))]
        public IHttpActionResult PostFindMom(FindMom findMom)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.FindMoms.Add(findMom);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = findMom.PetId }, findMom);
        }

        // DELETE: api/FindMoms/5
        [ResponseType(typeof(FindMom))]
        public IHttpActionResult DeleteFindMom(int id)
        {
            FindMom findMom = db.FindMoms.Find(id);
            if (findMom == null)
            {
                return NotFound();
            }

            db.FindMoms.Remove(findMom);
            db.SaveChanges();

            return Ok(findMom);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool FindMomExists(int id)
        {
            return db.FindMoms.Count(e => e.PetId == id) > 0;
        }
    }
}