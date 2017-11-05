using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoundCity.Models;
using System.Web.Security;

namespace FoundCity.Controllers
{
    public class PetMomController : Controller
    {
        CMemberService memberService = new CMemberService();
        // GET: PetMom
        public ActionResult Index()
        {
            if (User.Identity.IsAuthenticated) {
                ViewData["LoginCheckResult"] = "true";
            } else {
                ViewData["LoginCheckResult"] = "false";
            }
            return View();
        }

        [Authorize]
        public ActionResult MemberFindMom() {
            return View();
        }

        [Authorize]
        public ActionResult YCreateFindMom() {
            /*驗證頁面資料是否經過驗證*/
            if (ModelState.IsValid) {
                /*取得會員Id*/
                ViewData["MemberId"] = memberService.GetMemberId(User.Identity.Name);
            }

            return View();
        }

        [Authorize]
        [HttpPost]
        public ActionResult YCreateFindMom(FormCollection frm) {

            HttpPostedFileBase file1 = Request.Files["PetPhoto"];
            try {
                string UploadedPathFileName = Server.MapPath("~/images") + "\\" + file1.FileName;
                file1.SaveAs(UploadedPathFileName);
                return RedirectToAction("MemberFindMom", "PetMom");

                //測試先導原頁
                //return View();

            } catch (System.IO.DirectoryNotFoundException) {
                return View();
            }
        }
    }
}