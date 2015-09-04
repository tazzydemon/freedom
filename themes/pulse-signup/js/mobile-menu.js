$(function(){
	
	var $menuBtn = $('.mobile-menu'),
		$topNav	 =  $('.topNav');
		$topNavLi =  $('.topNav li'),
		$topNava =  $('.topNav a');
	
	$menuBtn.on('click', function(e){
		e.preventDefault();
		
		if($menuBtn.hasClass('openNav'))
		{
			$menuBtn.removeClass('openNav');
			TweenMax.staggerTo($topNavLi, 0.25, { marginTop: '-42px' }, 0.2);
			TweenMax.staggerTo($topNavLi, 0.25, { textIndent: '60px' }, 0.2);
		}else{
			$menuBtn.addClass('openNav');
			TweenMax.staggerTo($topNavLi, 0.25, { marginTop: 0 }, 0.2);	
			TweenMax.staggerTo($topNavLi, 0.25, { textIndent: '20px' }, 0.2);
		}
	});
    
});

