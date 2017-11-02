using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FoundCity.Models;
namespace FoundCity.Controllers
{
    public class MembersController : ApiController
    {
        CMemberService memberService = new CMemberService();

        public bool GetMemberId(string MemberId) {
            /*比對目前會員登入Id是否與View裡的會員Id相同,false = 被竄改*/
            bool result = memberService.GetHashMemberId(User.Identity.Name).Equals(memberService.GetHashMemberId(MemberId));
            return result;
        }
    }
}
