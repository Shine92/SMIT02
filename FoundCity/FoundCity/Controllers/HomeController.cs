using FoundCity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoundCity.Controllers {
    public class HomeController : Controller {

        HomeModel homeModel = new HomeModel();

        public ActionResult Index() {
            return View();
        }

        [HttpGet]
        public ActionResult Data() {
            var data = homeModel.Data();
            return Json(data,JsonRequestBehavior.AllowGet);
        }

    }
}