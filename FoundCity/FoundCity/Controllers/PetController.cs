using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoundCity.Models;
using System.Web.Security;
using FoundCity.ViewModels;

namespace FoundCity.Controllers
{
    public class PetController : Controller
    {
        CMemberService memberService = new CMemberService();
        private NewPetEntities db = new NewPetEntities();
        // GET: Pet
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
        public ActionResult MemberFindPet() {
            //為對照isSameData而建
            if (ModelState.IsValid) {
                /*取得會員Id*/
                ViewData["MemberId"] = memberService.GetMemberId(User.Identity.Name);
            }
            return View();
        }
        [Authorize]
        public ActionResult YCreateFindPet() {
            /*驗證頁面資料是否經過驗證*/
            if (ModelState.IsValid) {
                /*取得會員Id*/
                ViewData["MemberId"] = memberService.GetMemberId(User.Identity.Name);
            }

            return View();
        }
        [Authorize]
        [HttpPost]
        public ActionResult YCreateFindPet(FormCollection frm) {

            HttpPostedFileBase file1 = Request.Files["PetPhoto"];
            try {
                string UploadedPathFileName = Server.MapPath("~/images") + "\\" + file1.FileName;
                file1.SaveAs(UploadedPathFileName);
                return RedirectToAction("MemberFindPet", "Pet");

                //測試先導原頁
                //return View();

            } catch (System.IO.DirectoryNotFoundException) {
                return View();
            }
        }

        [HttpPost]
        public ActionResult getMemberData(int MemberId) {
            return Json(memberService.GetBasicMemberData(MemberId));
        }

        [HttpPost]
        public ActionResult isSameData(int MemberId) {
            var query = from o in db.FindPets
                        join t in db.FindMoms on o.HairColor equals t.HairColor
                        where o.CreatorId == MemberId
                        && o.HairColor == t.HairColor
                        && o.Species == t.Species
                        && o.Size == t.Size
                        && o.LostPlace1 == t.FindPlace1
                        && o.LostPlace2 == t.FindPlace2
                        //&& o.LostPlace3 == t.FindPlace3
                        //&& o.LostDate == t.FindDate
                        select new PetViewModel {
                            pid = o.PetId,
                            pphoto = o.PetPhoto,
                            mid = t.PetId,
                            mphoto = t.PetPhoto,
                            mconName = t.ContactMan,
                            mconSex = t.ContactSex,
                            mconTel = t.ContactTel
                        };
            //return Content("ok");
            if (query.Count() > 0) {
                return Json(query.ToList());
            } else {
                return Json("尚未有資料");
            }

        }
    }
}