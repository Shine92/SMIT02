using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
namespace FoundCity.Models {
    public class CMemberService {

        NewPetEntities db = new NewPetEntities();
        Member member = new Member();
        #region 註冊會員 OK
        public void Register(Member newMember) {
            /*密碼加密 1026 10:13測試*/
            newMember.Password = HasPassword(newMember.Password);
            /*新增資料到資料庫實體*/
            db.Members.Add(newMember);
            /*儲存資料庫變更*/
            db.SaveChanges();
        }
        #endregion
        #region 密碼加密 SHA1 OK
        public string HasPassword(string password) {
            /*定義SHA1的Hash物件*/
            SHA1 sha1 = new SHA1CryptoServiceProvider();
            string resultSha1 = Convert.ToBase64String(sha1.ComputeHash(Encoding.Default.GetBytes(password)));
            return resultSha1;
        }
        #endregion
        #region 帳號註冊重複確認 1061026_OK
        public bool AccountCheck(string Account) {
            bool result = false;
            /*在資料表查詢有無此帳號 回傳true or false*/
            var find = (from o in db.Members
                        where o.Account == Account
                        select o).Any();
            /*判斷是否有搜尋到會員,如果被註冊過,result為true*/
            if (find) {
                result = true;
            }
            /*傳回結果*/
            return result;
        }
        #endregion
        #region 信箱驗證 OK
        public string EmailVlidate(string Account, string AuthCode) {

            /*宣告變數存放會員驗證碼*/
            string VlidateAuthCode = string.Empty;

            /*取得該筆帳號*/
            var query = from o in db.Members
                        where o.Account == Account
                        select o;
            /*取得會員驗證碼*/
            foreach (var item in query) {
                VlidateAuthCode = item.AuthCode;
            }
            //Member VlidateMember = db.Members.Find(Account);
            /*錯誤 1027 14:00*/
            //db.Entry(Member).State == System.Data.Entity.EntityState.Modified;
            /*驗證後的回傳訊息*/
            string VlidateStr = string.Empty;
            /*判斷該筆帳號有無驗證碼*/
            if (VlidateAuthCode != null) {
                /*判斷驗證碼正確*/
                if (VlidateAuthCode == AuthCode) {
                    /*將資料庫中的驗證碼設為空*/
                    foreach (var item in query) {
                        item.AuthCode = string.Empty;
                    }
                    /*存回資料庫*/
                    db.SaveChanges();
                    VlidateStr = "帳號信箱驗證成功,現在可以登入了！";
                } else {
                    VlidateStr = "驗證碼錯誤,請重新確認或再次註冊！";
                }
            } else {
                VlidateStr = "傳送資料錯誤,請重新確認或再次註冊！";
            }
            return VlidateStr;
        }
        #endregion
        #region 登入確認 OK
        public string LoginCheck(string Account, string Password) {
            /*取得傳入帳號的會員資料*/
            try {
                Member findMember = (from o in db.Members
                                     where o.Account.Equals(Account)
                                     select o).Single();

                /*判斷是否有此會員*/
                if (findMember != null) {
                    /*判斷是否有經過驗證,有經驗證的驗證碼欄位會清空*/
                    if (string.IsNullOrWhiteSpace(findMember.AuthCode)) {
                        /*密碼確認*/
                        if (CheckPassword(findMember, Password)) {
                            /*密碼確認成功回傳空字串*/
                            return string.Empty;
                        } else {
                            return "密碼輸入錯誤！";
                        }
                    } else {
                        return "此帳號尚未經過Email驗證,請至您註冊的信箱完成啟用！";
                    }
                } else {
                    /*simon 11/01 14:32 還沒使用到 應該是catch已執行*/
                    return "無此會員帳號3";
                }
            } catch(ArgumentNullException) {
                /*僅輸入帳號 無法執行該query時的例外拋出*/
                return "請輸入您的密碼！";
            } catch(InvalidOperationException) {
                /*查詢不到該筆會員帳號時的例外拋出*/
                return "無此會員帳號！";
            }
        }
        #endregion
        #region 密碼確認 OK
        /*傳入Member.Password 和使用者輸入的Password*/
        public bool CheckPassword(Member CheckMember, string Password) {
            /*比對是否與資料庫的密碼與Has過的密碼是否一樣*/
            bool Result = CheckMember.Password.Equals(HasPassword(Password));
            return Result;
        }
        #endregion
        #region 取得使用者身份 OK
        public string GetRole(string Account) {
            /*角色預設為空字串*/
            string Role = "User";
            /*建立查詢語法*/
            var query = from o in db.Members
                        where o.Account.Equals(Account)
                        select new {
                            o.IsAdmin
                        };
            /*得到查詢結果*/
            foreach (var obj in query) {
                bool result = obj.IsAdmin;
                if (result) {
                    /*IsAdmin == 1 /true*/
                    Role += ",Admin";
                }
            }
            return Role;
        }
        #endregion
        #region 變更密碼
        public string ChangePassword(string UserName,string Password,string NewPassword) {
            /*找出登入者資料*/
            Member findMember = (from o in db.Members
                        where o.Account.Equals(UserName)
                        select o).Single();
            /*檢查使用者的舊密碼是否與資料庫密碼吻合*/
            if (CheckPassword(findMember, Password)) {
                /*若吻合就將密碼變更為新密碼,並且加密*/
                findMember.Password = HasPassword(NewPassword);
                /*儲存資料庫變更*/
                db.SaveChanges();
                return "密碼修改成功！";
            } else {
                return "舊密碼輸入錯誤！";
            }
        }
        #endregion
        #region 取得會員Id OK
        /*傳入User.Identity.Name 取得會員Id*/
        public string GetMemberId(string UserName) {
            /*設定初值為空字串*/
            var MemberId = string.Empty;
            /*取得會員資料*/
            var query = from o in db.Members
                        where o.Account.Equals(UserName)
                        select o;
            /*得到會員Id*/
            foreach (var item in query) {
                MemberId = Convert.ToString(item.Id);
            } 
            /*回傳會員Id*/
            return MemberId;
        }
        #endregion
    }
}