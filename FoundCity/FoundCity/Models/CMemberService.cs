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

        #region 註冊會員
        public void Register(Member newMember) {
            /*密碼加密 1026 10:13測試*/
            newMember.Password = HasPassword(newMember.Password);
            /*新增資料到資料庫實體*/
            db.Members.Add(newMember);
            /*儲存資料庫變更*/
            db.SaveChanges();
        }
        #endregion
        #region 密碼加密 SHA1
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
        #region 信箱驗證
        public string EmailVlidate(string Account, string AuthCode) {
            /*取得該筆帳號資料*/
            Member VlidateMember = db.Members.Find(Account);
            /*驗證後的回傳訊息*/
            string VlidateStr = string.Empty;
            /*判斷該筆帳號有無驗證碼*/
            if (VlidateMember.AuthCode != null) {
                /*判斷驗證碼正確*/
                if (VlidateMember.AuthCode == AuthCode) {
                    /*將資料庫中的驗證碼設為空*/
                    VlidateMember.AuthCode = string.Empty;
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