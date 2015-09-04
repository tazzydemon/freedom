<$Tag class="field CompositeField FieldGroup SchoolDetails nolabel <% if ColumnCount %>multicolumn<% end_if %>">
<% if $Description%>
    <p> $Description </p>
<% end_if %>
<div>
	<% loop FieldList %>
            <div class="fieldgroup-field $extraClass">
			$SmallFieldHolder
            </div>
	<% end_loop %>
</div>
<a style="color: white" class="btn darkGreen adBtnLarge" href="#">Submit</a>
</$Tag>
