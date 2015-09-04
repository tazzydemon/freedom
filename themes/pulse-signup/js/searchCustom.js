$(document).ready(function(){
    
    /*
     * Custom input clear button for search controls
     */
    $('.searchWrapper').each(function() {
        var $this = $(this),
        $searchInput = $this.find('input[type=text]'),
        $cancelButton = $this.find('.search-cancel');

        $searchInput.on('keyup change', function(){
            if($searchInput.val() == '') {
                $cancelButton.fadeOut('slow');
            }
            else {
                $cancelButton.fadeIn('slow');
            }
        }).focus(function(){
            if($searchInput.val() == '') {
                $cancelButton.fadeOut('slow');
            }
            else {
                $cancelButton.fadeIn('slow');
            }
        }).blur(function() {
            $cancelButton.fadeOut('fast');
        });

        $cancelButton.click(function() {
            $searchInput.val('');
        });
    });
});


