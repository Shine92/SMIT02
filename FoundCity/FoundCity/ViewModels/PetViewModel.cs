using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FoundCity.ViewModels {
    public class PetViewModel {
        public int pid { get; set; }
        public string pphoto { get; set; }
        //public Nullable<int> intData { get; set; }
        public int mid { get; set; }
        public string mphoto { get; set; }
        public string mconName { get; set; }
        public string mconSex { get; set; }
        public string mconTel { get; set; }
    }
}