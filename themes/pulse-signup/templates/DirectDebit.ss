<!DOCTYPE html>
<!--[if lt IE 7]>
<html lang="en" class="no-js ie6 oldie" data-theme-dir="$ThemeDir"> <![endif]-->
<!--[if IE 7]>
<html lang="en" class="no-js ie7 oldie" data-theme-dir="$ThemeDir"> <![endif]-->
<!--[if IE 8]>
<html lang="en" class="no-js ie8 oldie" data-theme-dir="$ThemeDir"> <![endif]-->
<!--[if gt IE 8]><!-->
<html class='no-js' lang='en' data-theme-dir="$ThemeDir">
<!--<![endif]-->
<head>
    <% base_tag %>
    <meta charset="utf-8"/>
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible"/>
    <meta content="" name="description"/>
    <meta content="" name="author"/>
    <meta content="width=device-width, initial-scale=1.0" name="viewport"/>
    <!-- Included CSS Files -->
    <script src="$ThemeDir/js/detectStylesheet.js"></script>
    <!-- selectivir -->
    <script src="$ThemeDir/js/thirdparty/modernizr.custom.34574.js"></script>
    <!--        <link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />-->
    <!--[if lt IE 9]>
    <script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <script src="$ThemeDir/js/thirdparty/selectivizr-min.js"></script>
    <![endif]-->

    <script type='text/javascript' src='//www.addressfinder.co.nz/assets/v2/widget.js'></script>
</head>

<body class='SignUp no-sidebar'>
<div class="site-container">

    <div class="topNavHeader">
        <a rel="home" class="brand" href="#"></a>
        <a class="mobile-menu" href="#">
            <span>Menu</span>
        </a>
    </div>
    <nav class="topNav">
       <h1>Direct Debit Authority Form</h1>
    </nav>
<%--

        <ul>
            <% loop $Menu(1) %>
                <li class="$LinkingMode">
                    <a <% if $MenuTitle != "Join Pulse" %>target="_new"<% end_if %> class="<% if $LinkingMode=="current" %>btn btnMed blue <% end_if %>" href="$Link">$MenuTitle</a>
                </li>
            <% end_loop %>
        </ul>
    </nav>--%>
</div>
<div class="desktopOnly">
    <!--<hr>
    <h1>$Title</h1>-->
</div>

<div id='container'>
    <header></header>
    <div id='main' role='main'>
        $Layout
        $Form

    </div>
    <footer></footer>
</div>
    <%-- <script src='//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js'></script>--%>

<script>
    $(function () {
        $("#Sign_up").tabs();
    });
</script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-31121409-2', 'pulseenergy.co.nz');
  ga('send', 'pageview');

</script>


<!--[if lt IE 7]>
<script src='//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js'></script>
<script>
    window.attachEvent('onload', function () {
        CFInstall.check({mode: 'overlay'})
    });
</script>
<![endif]-->
<!-- drop down lists -->
<div style="position:absolute;display:none" class="ac_results">
    <div class="scroll">
        <div class="bar"></div>
    </div>
</div>
</body>
</html>
