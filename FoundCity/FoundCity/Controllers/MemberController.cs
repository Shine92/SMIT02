using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using FoundCity.Models;
using FoundCity.ViewModels;
using System.Web.Security;

namespace FoundCity.Controllers {
    public class MemberController : Controller {
        MemberLoginViewModel LoginData = new MemberLoginViewModel();
        Member MemberData = new Member();
        CMemberService memberService = new CMemberService();
        CMailService mailService = new CMailService();
        #region 會員中心首頁
        // GET: Member
        [Authorize]
        public ActionResult Index() {
            return View();
        }
        #endregion
        #region 基本資料
        public ActionResult Basic() {
            return View();
        }
        #endregion
        #region 變更密碼
        public ActionResult Modify() {
            return View();
        }
        #endregion
        #region 會員登入
        public ActionResult Login() {
            /*判斷使用者是否已經登入*/
            if(User.Identity.IsAuthenticated){
                return RedirectToAction("Index","Home");
            } else {
                return View(LoginData);
            }
        }



        [HttpPost]
        public ActionResult Login(MemberLoginViewModel loginMember) {

            /*驗證帳號密碼*/
            string ValidateStr = memberService.LoginCheck(loginMember.Account, loginMember.Password);

            /*判斷是否有錯誤訊息*/
            if (string.IsNullOrEmpty(ValidateStr)) {
                /*取得登入角色*/
                string roleDate = memberService.GetRole(loginMember.Account);

                /*判斷是否選擇記住我*/
                if (Request["LoginRemeberResult"].Equals("true")) {
                    /*新增一個登入用Ticket*/
                    /*參考網址:toyo0103.blogspot.tw/2013/09/cformsauthentication.html*/
                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, loginMember.Account, DateTime.Now, DateTime.Now.AddDays(3), true,roleDate, FormsAuthentication.FormsCookiePath);
                    /*資料加密*/
                    string enTicket = FormsAuthentication.Encrypt(ticket);
                    /*資料存入Cookies*/
                    Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, enTicket));
                    /*註1:使用下面程式才能保留cookie,否則瀏覽器關閉後即登出 註2:使用下面程式需變更web.config => defaultUrl路徑,否則導回Index.aspx*/
                    FormsAuthentication.SetAuthCookie(loginMember.Account, true);
                } else {
                    /*新增一個登入用Ticket*/
                    /*參考網址:toyo0103.blogspot.tw/2013/09/cformsauthentication.html*/
                    FormsAuthenticationTicket ticket = new FormsAuthenticationTicket(1, loginMember.Account, DateTime.Now, DateTime.Now.AddMinutes(30), false,roleDate, FormsAuthentication.FormsCookiePath);
                    /*資料加密*/
                    string enTicket = FormsAuthentication.Encrypt(ticket);
                    /*資料存入Cookies*/
                    /*瀏覽器關閉後即登出*/
                    Response.Cookies.Add(new HttpCookie(FormsAuthentication.FormsCookieName, enTicket));
                }
                /*simon 11/2 09:22 測試使用*/
                //return Content("登入成功!" + FormsAuthentication.FormsCookieName);
                return RedirectToAction("Index", "Home");
            } else {
                ModelState.AddModelError("LoginError", ValidateStr);
                return View(loginMember);
            }
        }
        #endregion
        #region 會員登出
        /*設定Action需登入才能使用*/
        [Authorize]
        public ActionResult Logout() {
            FormsAuthentication.SignOut();
            return RedirectToAction("Login", "Member");
        }
        #endregion
        #region 會員註冊
        public ActionResult Register() {
            /*1026 09:07 註解測試*/
            //if (User.Identity.IsAuthenticated) {
            //    return RedirectToAction("Index","Home");
            //}
            return View(MemberData);
        }

        [HttpPost]
        public ActionResult Register(Member newMember) {

            /*如果帳號已被註冊過回傳true*/
            if (memberService.AccountCheck(newMember.Account)) {
                TempData["AccountIsExitOrNull"] = "您註冊的信箱已被使用！";

                /*停在註冊畫面*/
                return View(newMember);
            }

            /*測試資料*/
            //newMember.UserFirstName = "黃";
            //newMember.UserLastName = "宏隆";
            //newMember.UserGender = "1";
            //newMember.Account = "a15274@gmail.com";
            //newMember.Password = "a123b123";
            //newMember.Telephone = "0911234567";
            //newMember.AuthCode = "ABCDEFG123";
            //newMember.IsAdmin = false;
            //newMember.UserStatus = true;

            /*取得驗證碼*/
            newMember.AuthCode = mailService.GetValidateCode();
            /*預設為一般使用者*/
            newMember.IsAdmin = false;
            /*預設帳號狀態為啟用*/
            newMember.UserStatus = true;
            /*呼叫註冊功能*/
            memberService.Register(newMember);
            ///*取得寫好的驗證信範本內容*/
            string tempMail = System.IO.File.ReadAllText( Server.MapPath("~/Views/Shared/RegisterEmailTemplate.html"));
            /*宣告Email驗證用的Url*/
            UriBuilder ValidateUrl = new UriBuilder(Request.Url) {
                Path = Url.Action("EmailValidate", "Member"
                        , new {
                            UserName = newMember.Account
                            ,
                            AuthCode = newMember.AuthCode
                        })
            };
            /*使用者名稱*/

            string MailUserName = string.Format("{0} {1}",newMember.UserFirstName,newMember.UserLastName);
            /*把註冊資料填入驗證信範本*/
            string MailBody = mailService.GetRegisterMailBody(tempMail, MailUserName, ValidateUrl.ToString().Replace("%3F", "?"));
            /*寄出驗證信*/
            mailService.SendRegisterMail(MailBody, newMember.Account);
            /*儲存註冊訊息*/
            TempData["RegisterState"] = "註冊成功！請至您註冊的電子信箱啟用帳號。";
            return RedirectToAction("RegisterResult", "Member");
        }
        #endregion
        #region 忘記密碼
        public ActionResult Forget() {
            return View();
        }
        #endregion
        #region 接收驗證信連結傳進來的
        public ActionResult EmailValidate(string UserName,string AuthCode) {
           TempData["EmailValidate"] = memberService.EmailVlidate(UserName, AuthCode);
            return View();
        }
        #endregion
        #region 註冊成功
        public ActionResult RegisterResult() {
            return View();
        }
        #endregion
        #region 變更密碼
        /*[Authorize] 只有登入才能瀏覽的頁面*/
        [Authorize]
        public ActionResult ChangePassword() {
            return View();
        }

        [Authorize]
        [HttpPost]
        public ActionResult ChangePassword(MemberChangePasswordViewModel ChangeData) {
            if (ModelState.IsValid) {
                /*傳回變更密碼的狀態*/
                Session["ChangeState"] = memberService.ChangePassword(User.Identity.Name, ChangeData.Password, ChangeData.NewPassword);
            }
            return View();
        }
        #endregion
        #region 測試會員Id加密 OK
        public ActionResult test() {
            var MemberLoginId = string.Empty;
            var HashMemberLoginId = string.Empty;
            /*判斷是否經過登入驗證*/
            if (ModelState.IsValid) {
                /*取得會員Id 提供新增資料使用*/
                 MemberLoginId = memberService.GetMemberId(User.Identity.Name);
                HashMemberLoginId = memberService.GetHashMemberId(User.Identity.Name);
            }
            return Content("result1: " + MemberLoginId + " " + "result2:" + HashMemberLoginId);
        }
        #endregion
    }
}