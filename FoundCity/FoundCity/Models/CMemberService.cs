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
                    foreach(var item in query) {
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
    }
}