using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FoundCity.Models;
namespace FoundCity.ViewModels {
    public class MemberBasicViewModel {
        public string UserFirstName { set; get; }
        public string UserLastName { set; get; }
        public string UserGender { set; get; }
        public string Telephone { set; get; }
    }
}