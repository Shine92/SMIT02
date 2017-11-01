using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoundCity.Models;

namespace FoundCity.Controllers {
    public class StreetController : Controller {

        StreetModel streetModel = new StreetModel();

        [HttpGet]
        public ActionResult County() {
            var result = streetModel.County();
            return Json(result , JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult Area(string city) {
            var result = streetModel.Area(city);
            return Json(result);
        }

        [HttpPost]
        public ActionResult Road(string code) {
            var result = streetModel.Road(code);
            return Json(result);
        }

    }
}