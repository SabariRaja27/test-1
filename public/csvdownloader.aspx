<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="csvdownloader.aspx.cs" Inherits="PROTON.csvdownloader" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <style type="text/css">
        #csv
        {
            width: 1500px;
            height: 323px;
        }
    </style>
</head>
<body>
    <form id="form1" runat="server" action="csvdownloader.aspx">
    <div>
       <textarea id="csv" name="csv"></textarea>
    </div>
    </form>
</body>
</html>
