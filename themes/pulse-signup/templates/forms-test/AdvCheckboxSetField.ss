<ul id="$ID" class="$extraClass qOptions">
    <% loop $Options %>
        <li class="$Class">acsf
            <input id="$ID" class="radio" name="$Name" type="checkbox" value="$Value" <% if $Top.DataBind %> data-bind="$Top.DataBind"<% end_if %> <% if $isChecked %> checked<% end_if %><% if $isDisabled %> disabled<% end_if %> />
            <label for="$ID">
                <span class="radioWrapper">
                    <span class="cb"></span>
                    <span class="labelStrong">$Title</span>
                </span>
            </label>
        </li>
    <% end_loop %>
</ul>
<% if $MyAttribute('Note') %>
    <span class="note"> $MyAttribute('Note') </span>
<% end_if %>
