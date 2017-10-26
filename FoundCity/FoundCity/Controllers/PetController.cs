using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace FoundCity.Controllers
{
    public class PetController : Controller
    {
        // GET: Pet
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult MemberFindPet() {
            return View();
        }

        public ActionResult YCreateFindPet() {
            return View();
        }

        [HttpPost]
        public ActionResult YCreateFindPet(FormCollection frm) {
            HttpPostedFileBase file1 = Request.Files["PetPhoto"];

            string UploadedPathFileName = Server.MapPath("~/images") + "\\" + file1.FileName;
            file1.SaveAs(UploadedPathFileName);
            //Response.Cookies["uploadImg"].Value = file1.FileName;
            //TempData["PetPhoto"] = file1.FileName;
            return View();
            //return RedirectToAction("YCreateFindPet", "Home");
        }
    }
}