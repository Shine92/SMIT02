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
                        select new { o.mailcode , o.city })
                        .Distinct()
                        .ToList();

            var query2 =
                query1.GroupBy(x => x.city)
                .Select(x => x.First())
                .OrderBy(x=>x.mailcode)
                .ToList();

            var query3 = query2.Select(b => b.city).ToList();

            return Json(query3, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Area() {
            return null;
        }

        [HttpPost]
        public ActionResult Road() {
            return null;
        }

    }
}