using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using FoundCity.Models;
namespace FoundCity.ViewModels {
    public class MemberLoginViewModelcs {
        Member member = new Member();
        public string Account {
            set;
            get;
        }
        public string Password {
            set;
            get;
        }
    }
}