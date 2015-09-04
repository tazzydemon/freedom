
<ul id="$ID" class="$extraClass qOptions">
	<% loop $Options %>
		<li class="$Class">of
			<input id="$ID" class="radio" name="$Name" type="radio" value="$Value"<% if $Top.DataBind %> data-bind="$Top.DataBind"<% end_if %><% if $isChecked %> checked<% end_if %><% if $isDisabled %> disabled<% end_if %> <% if $Top.MyAttribute('required') %>required="$Top.MyAttribute('required')"<% end_if %>/>
			<label for="$ID">
                <span class="radioWrapper">
                    <span class="rb"></span>
                    <span class="labelStd">$Title</span>
                </span>
            </label>
		</li>
	<% end_loop %>
	<li>
        <a a href="#" class="textLink">Change</a>
    </li>
</ul>
