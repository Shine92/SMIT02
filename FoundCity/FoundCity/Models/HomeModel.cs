using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoundCity.Models {

    public class HomeModel {

        NewPetEntities db = new NewPetEntities();

        public HomeJson Data() {

            var queryPet = from e in db.FindPets
                           orderby e.PetId descending
                           select e;

            var queryMom = from e in db.FindMoms
                           orderby e.PetId descending
                           select e;

            var queryPetA = queryPet.ToList().Take(4).ToList();

            var queryMomA = queryMom.ToList().Take(4).ToList();

            HomeJson data = new HomeJson();
            data.Pet = queryPetA;
            data.Mom = queryMomA;

            return data;
        }
    }

    public class HomeJson {
        public List<FindPet> Pet { set; get; }
        public List<FindMom> Mom { set; get; }
    }

}