<div<% if $Name %>id="$Name"<% end_if %> class="section field $extraClass">

    <% loop $FieldList %>
    <div class="block field fieldgroup multi  <% if $Zebra %>fieldgroup-$Zebra<% end_if %> $returnCssClass('innerSectionEU') ">
            <div class="field $FirstLast $extraClassExclude('innerSection') $EvenOdd">
                $SmallFieldHolder
            </div>
    </div>
    <% end_loop %>
    <hr>
    <hr>
</div>
