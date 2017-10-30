using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoundCity.Models {

    public class StreetModel {

        NewPetEntities db = new NewPetEntities();

        public Array County() {
            var query = (from o in db.Streets
                        select o.city).Distinct();
            return query.ToArray();
            
        }

    }

   
}