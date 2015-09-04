<% if $RightTitle %>
    <p>$RightTitle</p>
<% end_if %>
<% if $LeftTitle %>
    <label class="left fieldholder-small-label">$LeftTitle</label>
<% end_if %>

<% if $Title %>
    <label class="fieldholder-small-label title">$Title</label>
<% end_if %>


<% if $Description %>
    <p>$Description <p>
<% end_if %>

<div class="middleColumn">
	<div class="nameWrapper">
    <span data-bind="visible: editContactNumber(), html: fullContactNumber, click: editContactNumber"></span> $Field <a href="#" class="textLink btn btnMed blue changeContactNumber">Change</a>
            <br/>
        <% if $RightTitle %>
            <p>$RightTitle</p>
        <% end_if %>
    </div>
</div>

<% if $Note %>
    <label class="fieldholder-small-label" <% if $ID %>for="$ID"<% end_if %>>$Note</label>
<% end_if %>

