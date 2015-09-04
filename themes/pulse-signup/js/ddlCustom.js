
$(document).ready(function(){
    $("select").each(function(){
        new DDL( $(this) );
        $ddl = $(this).parent().find('.ddl');

        $ddl.click(function(){

            var $resultsArea = $('.ac_results');

            //Unbind click for disabled select option
            // $firstSelect = $resultsArea.find('ul li:first-child');
            // $firstSelect.unbind();
            // $firstSelect.addClass('disabled-select');

            //position the div correctly
            // $resultsArea.css('top', '-=2');
            $resultsArea.css('width', '-=2');

            //add a custom scrollbar
            $resultsArea.each(function() {

                var $this = $(this);
                var $cwContent = $this.find('ul');

                //only add the scrollbar if content is scrollable
                if ($cwContent.get(0).scrollHeight > ($cwContent.height() + 1)){
                    $this.prepend('<div class="scroll"><div class="bar"></div></div>');
                }

                var $cwScroll = $this.find('.scroll').first(),
                $cwScrollBar = $cwScroll.children('.bar').first(),
                cwScrollHeight, cwHeight, contentScrollRatio,
                sbMaxDistance = $cwScroll.height() - $cwScrollBar.height();

                $cwContent.on('scroll', function() {
                    if ($cwContent[0].scrollHeight != cwScrollHeight) {
                        cwScrollHeight = $cwContent[0].scrollHeight;
                        cwHeight = $cwContent.height();
                        contentScrollRatio = sbMaxDistance / (cwScrollHeight - cwHeight);
                    }
                    $cwScrollBar.css({
                        marginTop: $(this).scrollTop() * contentScrollRatio
                    });
                });
            });
        });
    });

    //append the arrow span onload
    // $('.ddl').append( '<span class="ddl-arrow"></span>' );


});
