// adjust li's and .radioWrapper to be consistant heights within a row of 3

function li3()
{
    $('.widthFixedLarge li:nth-child(3n+1)' ).each(function(){
        var radio1 = $(this),
            radio2 = $(this).next(),
            radio3 = $(this).next().next(),
            liH_1    =  radio1.height(),
            liH_2    =  radio2.height(),
            liH_3    =  radio3.height(),
            rWH_1    =  radio1.find('.radioWrapper').height(),
            rWH_2    =  radio2.find('.radioWrapper').height(),
            rWH_3    =  radio3.find('.radioWrapper').height();

        var liH = (liH_1>liH_2) ? liH_1 : liH_2;
        liH = (liH>liH_3) ? liH : liH_3;

        var rWH =  (rWH_1>rWH_2) ? rWH_1 : rWH_2;
        rWH =  (rWH_1>rWH_3) ? rWH : rWH_3;

        radio1.height(liH).find('.radioWrapper').height(rWH);
        radio2.height(liH).find('.radioWrapper').height(rWH);
        radio3.height(liH).find('.radioWrapper').height(rWH);

    })
}

function li2()
{
	alert('t');
    $('.widthFixedLarge li:nth-child(2n+1)' ).each(function(){
        var radio1 = $(this),
            radio2 = $(this).next(),
            liH_1    =  radio1.height(),
            liH_2    =  radio2.height(),
            rWH_1    =  radio1.find('.radioWrapper').height(),
            rWH_2    =  radio2.find('.radioWrapper').height();

        var liH = (liH_1>liH_2) ? liH_1 : liH_2;

        var rWH =  (rWH_1>rWH_2) ? rWH_1 : rWH_2;

        radio1.height(liH).find('.radioWrapper').height(rWH);
        radio2.height(liH).find('.radioWrapper').height(rWH);

    })
}

function resizeLi()
{
	alert('r');	
	if( winW < 727 )
	{
		$('.radioWrapper').height('auto');
	} else if( winW < 758 && winW > 1037 ) {
		li2();
	} else{
		li3();
	}	
}


$(function(){
	var winW = $(window).width();
	
	$(window).resize(function(){
		var winW = $(window).width();
		resizeLi();		
	});
	
	resizeLi();
    
});

