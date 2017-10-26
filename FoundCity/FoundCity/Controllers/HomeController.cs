using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoundCity.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult FindPet() {
            //var query = from o in db.FindPets
            //            select o;
            //List<FindPet> viewData = query.ToList();
            //return View(viewData);
            return View();
        }
    }
}