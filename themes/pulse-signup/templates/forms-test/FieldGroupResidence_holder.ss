
<div<% if $Name %>id="$Name"<% end_if %> class="sehhction field $Type" <% if $DataBind %> data-bind="$DataBind"<% end_if %> >
fgr_h
    <div class="block field fieldgroup  <% if Zebra %>fieldgroup-$Zebra<% end_if %>">
    <% if $Title %><label class="left">$Title</label><% end_if %>
    <% if $Description %><p>$Description</p><% end_if %>
    <% if $LeftTitle %><label class="left">$LeftTitle</label><% end_if %>
    <% loop $FieldList %>
			<div class="field $FirstLast $EvenOdd ">
				$SmallFieldHolder
			</div>
		<% end_loop %>
<%--TODO: Check if change is needed on everything. <a class="textLink" href="#">Change</a>--%>
    </div>
	<% if $RightTitle %><label class="right">$RightTitle</label><% end_if %>
	<% if $Message %><span class="message $MessageType">$Message</span><% end_if %>

</div>