$(document).ready(function(){
    $('.dialogBox').click(function(e){
        e.preventDefault();
        var at = $(this).attr('dialog_id');
        if(at.indexOf(",") != -1){
            str = at.split(',');
            generate_Dialog(str[0],str[1]);
        }else{
            generate_Dialog(at);
        }
    });
});
// Generates the Lightbox with the given div_id given
function generate_Dialog(div_id,sec_or_div){

    var div;
    if(sec_or_div === 'section')
        div = $("#"+div_id).closest('.section');
    else
        div = $("#"+div_id).closest('.field');

    var dialogWidth = ($(window).width() < 960)? 'auto': 960 ;

    div.dialog(
    {
        width: dialogWidth,
        maxWidth:'960',
       // fluid: true,
        position: ['center', 'middle'],
        show: 'blind',
        hide: 'blind',
        closeText: 'X Close',
        buttons: [{
            "text":'Save Edit',
            "click": function(ev,ui) {$(this).dialog('close')},
            "class": 'btn btnLarge lightbox_action'
        }],
        modal: true,
        close : function(ev,ui) {
            $(this).dialog('destroy').show();
        }
//        open: function(event, ui) {
//            $(event.target).parent().css('position', 'absolute');
//            $(event.target).parent().css('margin', 'auto');
//            $(event.target).parent().css('top', '40%');
//            $(event.target).parent().css('left', '0');
//            $(event.target).parent().css('right', '0');
//            $(event.target).parent().css('bottom', '0');
//            $(event.target).parent().css('max-width', '960px');
//        }

    });
    resizeLi(div);
    div.dialog("open");
    return false;
}
