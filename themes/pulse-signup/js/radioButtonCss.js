// adjust li's and .radioWrapper to be consistant heights within a row of 3

function li3(optionset)
{
//    console.log('3start');
//    console.log(optionset);
//    console.log('3finish');
    optionset.find('li:nth-child(3n+1)' ).each(function(){
        //log('nth child found');
        var radio1 = $(this),
            radio2 = $(this).next(),
            radio3 = $(this).next().next(),
            rWH_1    =  radio1.find('.radioWrapper').height(),
            rWH_2    =  radio2.find('.radioWrapper').height(),
            rWH_3    =  radio3.find('.radioWrapper').height();

        var rWH =  (rWH_1>rWH_2) ? rWH_1 : rWH_2;
        rWH =  (rWH_1>rWH_3) ? rWH : rWH_3;

        //console.log('heights '+rWH+''+rWH_1+''+rWH_2+''+rWH_3+'');

        radio1.find('.radioWrapper').height(rWH);
        radio2.find('.radioWrapper').height(rWH);
        radio3.find('.radioWrapper').height(rWH);


		radio1.css("margin-top","5px");
		radio2.css("margin-top","5px");
		radio3.css("margin-top","5px");

    });
}

function li2(optionset)
{
	//log('2');
     optionset.find('li:nth-child(2n+1)' ).each(function(){
        var radio1 = $(this),
            radio2 = $(this).next(),
            rWH_1    =  radio1.find('.radioWrapper').height(),
            rWH_2    =  radio2.find('.radioWrapper').height();

        var rWH =  (rWH_1>rWH_2) ? rWH_1 : rWH_2;

        radio1.find('.radioWrapper').height(rWH);
        radio2.find('.radioWrapper').height(rWH);
		radio1.css("margin-top","5px");
		radio2.css("margin-top","5px");
    });
}

function resizeLi(optionset)
{
	var winW = $(window).width();
	if( winW < 727 )
	{
		//$('.radioWrapper, .widthFixedLarge li').height('auto');
	} else if ( winW > 1017 ){
		li3(optionset);
	} else {
		li2(optionset);
	}
}


// $(function(){

	// $(window).resize(function(){
	// resizeLi();
	// });

// resizeLi();

// });

