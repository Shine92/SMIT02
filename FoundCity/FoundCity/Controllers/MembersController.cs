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
        // POST: api/Members/1 simon 11/03 13:22 尚未使用
        public IHttpActionResult GetMember(string MemberId) {
            /*比對目前會員登入Id是否與View裡的會員Id相同,false = 被竄改*/
            bool result = memberService.GetHashMemberId(memberService.GetMemberId(User.Identity.Name)).Equals(memberService.GetHashMemberId(MemberId));
            var IsResult = Convert.ToString(result);
            return Ok(IsResult);
        }
    }
}
