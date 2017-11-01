using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;
using System.Security.Principal;
using System.Threading;
namespace FoundCity
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // 應用程式啟動時執行的程式碼
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);            
        }
        void Application_OnPostAuthenticateRequest(object sender, EventArgs e) {
             
            /*宣告目前使用者*/
            IPrincipal contextUser = Context.User;
            /*如果該驗證是由Forms發出*/
            if (contextUser.Identity.AuthenticationType == "Forms") {
                /*宣告當前User票券資料*/
                FormsAuthenticationTicket ticket = ((FormsIdentity)HttpContext.Current.User.Identity).Ticket;
                /*取出票券裡的資料 分割成陣列*/
                string [] roles = ticket.UserData.Split(new char[] { ',' });
                /*指派角色到User物件*/
                HttpContext.Current.User = new GenericPrincipal(contextUser.Identity, roles);

                Thread.CurrentPrincipal = HttpContext.Current.User;
            }
        }
    }
}