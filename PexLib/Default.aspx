<%@ Page Title="Home Page" Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="PexLib._Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>PexLib Test</title>
    <style type="text/css">
        .testPanel {
        	background-color: Black;
        	color: White;
        	width: 200px;
        	height: 70px;
        	padding: 10px;
        }
        .testModal {
            height: 400px;
            width: 400px;	
            padding: 40px;
        }
    </style>
    <script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.4.4.min.js" type="text/javascript"></script>
    <script src="/PexLib/pex.js" type="text/javascript"></script>
    
    <script language="javascript" type="text/javascript">
        $(function () {

            $$$.panelSpeed = 'fast'; // if you dont set the speed it will auto default to slow
            $$$.modalSpeed = 'fast';

            $$$.prepPanel({ control: $('#OpenPanel1Button'), click: true, panel: $('#Panel1'), offset: { top: 5, left: 0} })
               .prepPanel({ control: $('#OpenPanel2Button'), panel: $('#Panel2'), offset: { top: 5, left: 20} });

            $$$.prepModal('#ModalBg', '#Modal1');

            $('#OpenModalButton').click(function () { $$$.showModal('#Modal1'); });
            $('#ClosePanelButton').click(function () { $$$.closeModal(); });

        });
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    <input id="OpenPanel1Button" type="button" value="Open Panel 1" />
    <input id="OpenPanel2Button" type="button" value="Open Panel 2" onclick="$$$.togglePanel('#Panel2');" />
    
    <br />afblkjsbdfkjabsdkfjbzkdfjb;asjdb ;fjsbd fjbsadlfujbdlskj
    <br />daufljbasdklfbskdlfbskfbjd skjfbs lkj fbls fse flshbflsjekd
    <br />aefblasjeb fue fiuasebfliuwseab fliueasb fasue fs
    
    <br /><input id="OpenModalButton" type="button" value="Open Modal" />
    </div>
    
    <!-- Panels -->
    <div id="Panel1" class="testPanel">
        This is the first panel. it has a top offset of 5 and left offset of 0
    </div>
    
    <div id="Panel2" class="testPanel">
        This is another panel. it has a top offset of 5 and left offset of 20
    </div>
    
    <!-- Modals -->
    <div id="ModalBg"></div>
    
    <div id="Modal1" class="testModal">
        This is a Modal. When you call closeModal() it knows to close the active modal - because it keeps its state in memory.
        <br />
        <input id="ClosePanelButton" type="button" value="Close Modal" />
    </div>
    
    </form>
</body>
</html>