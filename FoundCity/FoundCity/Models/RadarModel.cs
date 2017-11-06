using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoundCity.Models {

    public class RadarModel {

        NewPetEntities db = new NewPetEntities();

        public List<FindPet> selectPet(string City , string Area) {
            var query = from o in db.FindPets
                        where o.LostPlace1 == City
                        select o;

            var queryB = from o in query
                         where o.LostPlace2 == Area
                         select o;

            return queryB.ToList();
        }

        public List<FindMom> selectMom(string City , string Area) {
            var query = from o in db.FindMoms
                        where o.FindPlace1 == City
                        select o;

            var queryB = from o in query
                         where o.FindPlace2 == Area
                         select o;

            return queryB.ToList();
        }

    }
}