using FoundCity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;

namespace FoundCity.Controllers
{
    
    public class YMemberFindPetController : ApiController
    {
        private NewPetEntities db = new NewPetEntities();
        CMemberService memberService = new CMemberService();

        public List<FindPet> GetYMemberFindPet() {
            //CookieHeaderValue cookie = Request.Headers.GetCookies("uid").FirstOrDefault();

            //CreatorId
            int uid = Convert.ToInt32(memberService.GetMemberId(User.Identity.Name));
            var query = from o in db.FindPets
                        where o.CreatorId == uid
                        orderby o.PetId descending
                        select o;

            var viewData = query.ToList();
            return viewData;

            
            
            //CookieHeaderValue cookie = Request.Headers.GetCookies("uid").FirstOrDefault();

            ////CreatorId
            //int uid = Convert.ToInt32(cookie["uid"].Value);
            //var query = from o in db.FindPets
            //            where o.CreatorId == uid
            //            orderby o.PetId descending
            //            select o;

            //var viewData = query.ToList();
            //return viewData;

        }
    }
}
