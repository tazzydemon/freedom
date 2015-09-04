
<ul id="$ID"  class="$extraClassExclude('innerSection') qOptions">
    <% loop $Options %>
        <li class="$Class">aof
            <input id="$ID" class="radio" name="$Name" type="radio" data-benefit="$Benefit" value="$Value"<% if $Top.DataBind %> data-bind="$Top.DataBind"<% end_if %><% if $isChecked %> checked<% end_if %><% if $isDisabled %> disabled<% end_if %> />
            <label for="$ID">
                <span class="radioWrapper">
                    <span class="rb"></span>
                    <span class="labelStrong">$Title</span>
                    <% if $Tags %>
                        <% loop $Tags %>
                            <span class="tag $Tag.CSSClass">$Tag.Value</span>
                        <% end_loop %>
                    <% end_if %>
                <% if $_plainTextRadioLabels($RadioLabel , "", $RadioLabelUsage) %>
                    <span class="labelStd">$_plainTextRadioLabels($RadioLabel , "", $RadioLabelUsage)</span>
                <% end_if %>

                <% if $_plainTextRadioLabels($Row2 , "", "Extra row if needed") %>
                    <span class="labelStd">$_plainTextRadioLabels($Row2, "","Extra row if needed")</span>
                <% end_if %>

                <% if $_plainTextRadioLabels($Row3, "", "Third line if needed") %>
                    <span class="labelStd">$_plainTextRadioLabels($Row3, "","Third line if needed")</span>
                <% end_if %>

                </span>

                <% if $_plainTextRadioNotes($Note, "", $Name) %>
                    <span class="note yes">$_plainTextRadioNotes($Note , "", $Name)</span>
                <% end_if %>

                <% if $_plainTextRadioNotes($Note1, "", $Name) %>
                    <span class="note not">$_plainTextRadioNotes($Note1 , "", $Name)</span>
                <% end_if %>

            </label>
        </li>
    <% end_loop %>
    <li style="display:none">
        <a href="#" class="textLink btn btnMed blue">Change</a>
    </li>
</ul>
 <% if $MyAttribute('Note') %>
        <span class="note"> $MyAttribute('Note') </span>
<% end_if %>
