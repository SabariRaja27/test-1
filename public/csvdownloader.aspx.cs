using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace PROTON
{
    public partial class csvdownloader : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!string.IsNullOrEmpty(Base.Common.CommonUtils.CnvStr(Request["csv"])))
            {
                DateTime time = DateTime.Now;
                Response.ContentType = "text/csv";
                Response.AddHeader("Content-Disposition", "attachment;filename=" + "PROTON  " + time.ToString("D") + "  Time" + time.ToLongTimeString() + ".csv");
                Response.Write(Request["csv"]);
                //Response.Flush();
                Response.End();
            }
        }
    }
}