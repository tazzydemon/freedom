
<div class="fieldgroup <% if $Zebra %> fieldgroup-zebra<% end_if %>" <% if $ID %>id="$ID"<% end_if %>>fg
	<% loop $FieldList %>
		<div class="fieldgroup-field $FirstLast $EvenOdd $extraClass">
			$SmallFieldHolder
		</div>
	<% end_loop %>
</div>
