<div<% if $Name %>id="$Name"<% end_if %> class="section field $extraClass">

    <% loop $FieldList %>
    <div class="block field fieldgroup multi  <% if Zebra %>fieldgroup-$Zebra<% end_if %> $returnCssClass('innerSection')">


            <div class="field $FirstLast $extraClassExclude('innerSection') $EvenOdd">
                
                $SmallFieldHolder
            </div>
        <% if $Last %>
        <div class="subBlock submitMessage">
                                        <p>Thanks for submitting your school. We will process this request and get back to you</p>
        </div>
        <% end_if %>

        <%--TODO: Check if change is needed on everything. <a class="textLink" href="#">Change</a>--%>


    <% if $Message %><span class="message $MessageType">$Message</span><% end_if %>
    <hr>
    <hr>
    </div>
    <% end_loop %>

</div>
