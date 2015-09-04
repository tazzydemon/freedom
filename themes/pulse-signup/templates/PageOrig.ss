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
    <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
    <script src="$ThemeDir/js/thirdparty/selectivizr-min.js"></script>
    <![endif]-->

    <script type='text/javascript' src='http://www.addressfinder.co.nz/assets/v2/widget.js'></script>
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

        <ul>
            <% loop $Menu(1) %>
                <li class="$LinkingMode">
                    <a <% if $MenuTitle != "Join Pulse" %>target="_new"<% end_if %> class="<% if $LinkingMode=="current" %>btn btnMed blue <% end_if %>" href="$Link">$MenuTitle</a>
                </li>
            <% end_loop %>
        </ul>
    </nav>
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
    <%--<script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>--%>
    <%--<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>--%>
    <%--<script src="http://code.jquery.com/ui/1.10.3/jquery-ui.js"></script>--%>
    <%--        <script src="$ThemeDir/js/thirdparty/jquery.ui.datepicker-en-GB.js"></script>--%>
    <%--       <script src="/themes/pulse-signup/js/DateField.js"></script>--%>
    <%--<script src="$ThemeDir/js/thirdparty/zebra/zebra_datepicker.js"></script>--%>
    <%--<script>--%>
    <%--window.jQuery || document.write("<script src='js/jquery-1.6.2.min.js'>\x3C/script>")--%>
    <%--</script>--%>

<script>
    $(function () {
        $("#Sign_up").tabs();
    });
</script>

    <%--<script>--%>
    <%--(function (w, d) {--%>
    <%--w.af = function (cb) {--%>
    <%--w.af.q = w.af.q || [];--%>
    <%--w.af.q.push(cb);--%>
    <%--};--%>

    <%--var af = d.createElement('script');--%>
    <%--af.async = true;--%>
    <%--af.src = (w.location.protocol === 'https:' ? 'https' : 'http') + '://addressfinder.infinity.io/af.min.js';--%>
    <%--(d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(af);--%>
    <%--})(window, document);--%>
    <%--</script>--%>

<!-- drop down lists -->
    <%--<script src="$ThemeDir/js/dropDownLists.js"></script>--%>
    <%--<script src="$ThemeDir/js/ddlCustom.js"></script>--%>

<!-- search/address finder field -->
    <%--<script src="$ThemeDir/js/searchCustom.js"></script>--%>

<!-- form validation -->
    <%--<script src="$ThemeDir/js/thirdparty/jquery.validate.js"></script>--%>
    <%--<script src="$ThemeDir/js/thirdparty/additional-methods.min.js"></script>--%>
    <%--<script src="$ThemeDir/js/thirdparty/verify.notify.min.jsxx"></script>--%>
    <%--<script src="$ThemeDir/js/thirdparty/datejs/date-en-NZ.js"></script>--%>
    <%--<script src="$ThemeDir/js/form-validation.js"></script>--%>


<!-- knockout.js -->
    <%--<script src="$ThemeDir/js/thirdparty/knockout.js"></script>--%>
    <%--<script src="$ThemeDir/js/formKnockout.js"></script>--%>

    <%--<script src="$ThemeDir/js/formFlow.js"></script>--%>


    <%--<script src="$ThemeDir/js/dialogBox.js"></script>--%>

<!-- sammy.js -->
    <%--<script src="$ThemeDir/js/thirdparty/sammy.js"></script>--%>

<!-- greensock -->
    <%--<script src="http://cdnjs.cloudflare.com/ajax/libs/gsap/1.10.1/TweenMax.min.js"></script>--%>
    <%--<script src="$ThemeDir/js/thirdparty/jquery.gsap.js"></script>--%>
    <%--<script src="$ThemeDir/js/mobile-menu.js"></script>--%>



<!--radio buttons -->
    <%--<script src="$ThemeDir/js/radioButtonCss.js"></script>--%>

<script>
    var _gaq = [
        ["_setAccount", "UA-XXXXX-X"],
        ["_trackPageview"],
        ["_trackPageLoadTime"]
    ];
    (function (d, t) {
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
        g.async = 1;
        g.src = ("https:" == location.protocol ? "//ssl" : "//www") + ".google-analytics.com/ga.js";
        s.parentNode.insertBefore(g, s)
    }(document, "script"));
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
