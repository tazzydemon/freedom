<div<% if $Name %>id="$Name"<% end_if %> class="section field $extraClass $Type" <% if $DataBind %> data-bind="$DataBind"<% end_if %> >

<div class="block field fieldgroup  <% if Zebra %>fieldgroup-$Zebra<% end_if %>">

    <span class="info" style="float:left"></span>
        <span style="float:left;">
            <% if $Title %><label class="left">$Title</label><% end_if %>
            <label class="nameWrapper cancellation">
                We will need to speak to you to get some more information.</label>
            <% if $Description %><p>desc $Description</p><% end_if %>
            <% if $LeftTitle %><label class="left">left $LeftTitle</label><% end_if %>
                <label>Our friendly Customer Service team can help you build your Freedom Plan over the phone.</label>
            <div style="clear:both">
                <label class="left clearboth">
                    <span class="icp-display table-layout partial">
                        <span class="table-row">
                            <span class="table-cell middle green">Phone</span>
                            <span class="table-cell middle">0800 785 733</span>
                        </span>
                    </span>
                    <span class="icp-display table-layout partial">
                        <span class="table-row">
                            <span class="table-cell middle green">Email</span>
                            <span class="table-cell middle"><a style="color:#333" href="mailto:joinus@pulseenergy.co.nz?subject=Join Pulse">joinus@pulseenergy.co.nz</a></span>
                        </span>
                    </span>

                </label>
            </div>
        </span>
    <% loop $FieldList %>
        <div class="field $FirstLast $EvenOdd $extraClass">
            $SmallFieldHolder
        </div>
    <% end_loop %>
    <%--TODO: Check if change is needed on everything. <a class="textLink" href="#">Change</a>--%>
</div>
<% if $RightTitle %><label class="right">$RightTitle</label><% end_if %>
<% if $Message %><span class="message $MessageType">$Message</span><% end_if %>
<hr>
<hr>
</div>


