using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoundCity.Models;

namespace FoundCity.Controllers {
    public class RadarController : Controller {

        public RadarModel radarModel = new RadarModel();

        // GET: Radar
        public ActionResult Index() {
            return View();
        }

        [HttpPost]
        public ActionResult getPet(string City , string Area) {
            var data = radarModel.selectPet(City, Area);
            return Json(data);
        }

        [HttpPost]
        public ActionResult getMom(string City , string Area) {
            var data = radarModel.selectMom(City , Area);
            return Json(data);
        }

    }
}