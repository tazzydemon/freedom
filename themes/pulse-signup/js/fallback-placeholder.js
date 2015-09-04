function inputPlaceholderText() {
	var placeholderClass = 'placeholder';
	
	$('input[placeholder], textarea[placeholder]').each(function() {
		var placeholderText = $(this).attr('placeholder');
		$(this).removeAttr('placeholder');
		$(this).attr('data-placeholder', placeholderText);
		if (!$(this).val()) $(this).val(placeholderText);
		
		$(this).parents('form').first().submit(function() {
			$(this).find('input[data-placeholder!=]').each(function () {
				if ($(this).val() == $(this).attr('data-placeholder'))
					$(this).val('');
			});
		});
	}).focus(function () {
		if ($(this).val() != $(this).attr('data-placeholder')) return;
		$(this).val('');
		$(this).removeClass(placeholderClass);
	}).blur(function () {
		if ($(this).val() != '') return;
		$(this).val($(this).attr('data-placeholder'));
		$(this).addClass(placeholderClass);
	}).addClass(placeholderClass);
} 

$(function(){
	inputPlaceholderText();
});