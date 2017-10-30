using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoundCity.Models;

namespace FoundCity.Controllers {
    public class StreetController : Controller {

        StreetModel sModel = new StreetModel();

        NewPetEntities db = new NewPetEntities();

        [HttpGet]
        public ActionResult County() {

            var query1 = (from o in db.Streets
                          select new { o.mailcode,o.city })
                        .Distinct()
                        .ToList();

            var query2 =
                query1.GroupBy(x => x.city)
                .Select(x => x.First())
                .OrderBy(x => x.mailcode)
                .ToList();

            var query3 = query2.Select(b => b.city).ToList();

            return Json(query3,JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Area(string city) {
            var query = (from o in db.Streets
                         where o.city == city
                         select new { o.mailcode,o.country }).Distinct();
            return Json(query.ToList());
        }

        [HttpPost]
        public ActionResult Road(string code) {
            var query = from o in db.Streets
                        where o.mailcode == code
                        select new { o.id,o.road };
            return Json(query.ToList());
        }

    }
}