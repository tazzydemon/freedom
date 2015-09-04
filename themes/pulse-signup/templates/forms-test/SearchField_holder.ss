
<label class="fieldholder-small-label title">$Title</label>
<div class="middleColumn">
    sf_h
        <div class="searchWrapper">
            $Field
            <span class="search"></span>
            <span class="search-cancel"></span>
        </div>
        <% if $LeftTitle %>
            $LeftTitle
        <% end_if %>
</div>
<% if $RightTitle %>

<div class="helpfulTipWrapper">
    <div class="dottedLine"></div>
    <div class="helpfulTip">
        <span class="questionIcon"></span>
        <p>$RightTitle</p>
    </div>
</div>
<% end_if %>