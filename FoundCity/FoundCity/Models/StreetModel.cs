using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoundCity.Models {

    public class StreetModel {

        NewPetEntities db = new NewPetEntities();

        public List<string> County() {

            var query1 = (from o in db.Streets
                          select new { o.mailcode , o.city })
                        .Distinct()
                        .ToList();

            var query2 =
                query1.GroupBy(x => x.city)
                .Select(x => x.First())
                .OrderBy(x => x.mailcode)
                .ToList();

            var query3 =
                query2.Select(b => b.city)
                .ToList();

            return query3;
        }

        public List<area> Area(string city) {

            var query = (from o in db.Streets
                         where o.city == city
                         select new area (){
                             mailcode =  o.mailcode ,
                             country = o.country
                         }).Distinct();

            return query.ToList();
        }

        public List<street> Road(string code) {

            var query = from o in db.Streets
                        where o.mailcode == code
                        select new street (){
                            id = o.id ,
                            road = o.road
                        };

            return query.ToList();
        }

    }

    public class area{
        public string mailcode { set; get; }
        public string country { set; get; }
    }

    public class street {
        public int id { set; get; }
        public string road { set; get; }
    }

}