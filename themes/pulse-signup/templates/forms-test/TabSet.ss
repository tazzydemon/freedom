<div $getAttributesHTML("class") class="ss-tabset $extraClass">
	<ul class="tabNav">
	<% loop $Tabs %>
		<li class=" tab-$Pos $FirstLast $MiddleString $extraClass">
            <span class="table-layout full">
                <span class="table-row">
                    <span class="table-cell middle">
                        <a href="#$id" class="tab-anchor"  id="tab-$id">$Title</a>
                    </span>
                    <span class="table-cell middle">
                        <span class="icon $ID"></span>
                    </span>
                </span>
            </span>
            <span class="currentTri"></span>
        </li>
	<% end_loop %>
	</ul>
<%--	<ul class="innerTabNav">
		<li><a href="#" class="buildPlanInner">Address, ICP</a></li>
	</ul>--%>

	<h1 class="mobileOnly">$Title</h1>
    <% if $LeftTitle %>
        <p>$LeftTitle</p>
    <% end_if %>
	<% loop $Tabs %>
		<% if $Tabs %>
			$FieldHolder
		<% else %>
			<div $AttributesHTML>
                <% if $RightTitle %>
                    <p style="clear:both" >$RightTitle</p>
                <% end_if %>
				<% loop $Fields %>
					$FieldHolder
				<% end_loop %>
			</div>
		<% end_if %>
	<% end_loop %>
</div>

