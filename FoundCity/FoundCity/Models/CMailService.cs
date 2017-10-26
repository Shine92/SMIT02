using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Net.Mail;
namespace FoundCity.Models {
    public class CMailService {

        /*設定寄件的Mail*/
        private string sendMailAccount = "foundcity2017@gmail.com";
        private string sendMailPassword = "FoundPet02";
        private string sendMail = "foundcity2017@gmail.com";

        #region 產生驗證碼
        public string GetValidateCode() {
            string[] Code = { "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9" };
            string ValidateCode = string.Empty;
            Random random = new Random();
            for (int i = 0; i < 10; i++) {
                ValidateCode += Code[random.Next(Code.Count())];
            }
            return ValidateCode;
        }
        #endregion
        #region 將註冊資料填入驗證信
        public string GetRegisterMailBody(string tempString, string UserName, string ValidateUrl) {
            /*註冊資料填入*/
            tempString = tempString.Replace("{{Account}}", UserName);
            tempString = tempString.Replace("{{ValidateUrl}}", ValidateUrl);
            return tempString;
        }
        #endregion
        #region 寄驗證信的方法
        public void SendRegisterMail(string MailBody, string ToMail) {
            /*建立寄信用Smtp物件*/
            SmtpClient smtpServer = new SmtpClient("smtp.gmail.com");
            /*Gmail使用的Port*/
            smtpServer.Port = 587;
            /*驗證寄件者資料*/
            smtpServer.Credentials = new System.Net.NetworkCredential("foundcity2017@gmail.com", "FoundPet02");
            /*開啟SSL*/
            smtpServer.EnableSsl = true;
            /*宣告信件內容物件*/
            MailMessage mail = new MailMessage();
            /*設定寄信的信箱*/
            mail.From = new MailAddress(sendMail);
            /*設定收件者信箱*/
            mail.To.Add(ToMail);
            /*設定信件主旨*/
            mail.Subject = ("會員註冊確認信");
            /*設定信件內容*/
            mail.Body = MailBody;
            /*設定信件內容為HTML格式*/
            mail.IsBodyHtml = true;
            /*發出信件*/
            smtpServer.Send(mail);
            /*結束資源*/
            mail.Dispose();
            smtpServer.Dispose();

        }
        #endregion
    }
}