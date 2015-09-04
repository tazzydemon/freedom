$(document).ready(function(){

    /*
     * Stop form submmiting by pressing Enter
     */
     $('input[type=text], select').keypress(function(event) { return event.keyCode != 13; });

    


    /*
     * Initialise a new AddressFinder and customise for searching suburbs only
     */
     var widget = new AddressFinder.Widget(document.getElementById('Form_SignUpForm_Suburb'), "V3YULPXNHT49F8BCE7DG",
        {
            manual_style:true,
            show_addresses:true,
            show_locations: true,
            address_params: {
                street: 0,
                city: 0,
                region: 0
            }
        });

    // Global request boolean, used to check if an ajax request is currently underway 
    var isRequesting = false;
    // GLobal smart-meter boolean, truth value dependent on weather 
    var $networkSmartMeter = false;

        



// ==========================================================================
//                              QUESTIONS
// ==========================================================================
    
    
    /* 
     * Populates the Install address fields of the application form
     * the Where do you live question in the first tab
     */
    function populateAddress(address){

        var inputText = address.val();         
        var ar = inputText.split(',');
        
        if(ar.length == 4){
            ar[0] = ar[0]+','+ar[1];
            ar[1] = ar[2];
            ar[2] = ar[3];
        }
        
        if(ar[0] && ar[1] && ar[2]) {
            $('#Form_SignUpForm_Application_HouseNumberAndStreetName').val(ar[0].trim());
            $('#Form_SignUpForm_Application_Suburb').val(ar[1].trim());
            $('#Form_SignUpForm_Application_City').val(ar[2].trim());
        }
        //console.log('House Number and Street Name: '+ar[0]);console.log('Suburb: '+ ar[1]);console.log('City: '+ ar[2]);//Debugging   
    }

    
    /* Check to see if an textfield type question has been answered
     * Shows the next section if requirements are met
     */
    function textQuestionAnswered(section) {
        section.find("input[type=text]").keyup(function() {
            var $this = $(this);
            var $inputText = $this.val().replace(/\s+/g, '');

            if( $inputText.length >= 3 ) {
                showSection(section,"completedSection");
                showSection(section.next(), "openSection");
            }
            if($this.is(':focus')){
                section.removeClass('hoverSection');
            }
        }).blur(function(){
             var $this = $(this);
             if( $this.val().length >= 3) {
                showSection(section,"completedSection");
                showSection(section.next(), "openSection");
            }
        });
    }

    
    /* Sends a request for an ICP Number based on entered address
     * Shows the next section if requirements are met, otherwise stop the form/flow
     */
    function getICPNumber(addressInput, section) {

        var $this = addressInput;          
        var $waitIndicator = '<img src="themes/pulse-signup/images/non-sprite/ajax-loader.gif" class="loader">';

        if($this.val() && isRequesting === false) {
            $.ajax({
                url: $('#Form_SignUpForm_Suburb').data('api-url')+'getICPNumber',
                type: 'POST',
                dataType: 'json',
                data: {address: addressInput.val()},
                beforeSend: function() {
                    $(".ajax-error").remove();
                    addressInput.closest('.section').after($waitIndicator);
                    isRequesting = true;
                    // console.log("REQUEST IS SENT");
                },               
            })
            .done(function(data) {
                var $icpNumber = data.result;
                if ($.isEmptyObject($icpNumber)) {
                    slideDownSection($(".stopFormBlock"));
                    $("span.icp-result").html("");
                    $("#Form_SignUpForm_Cancellation_Reason").val("Can't Find ICP");
                    // console.log("ICP NOT FOUND");
                }
                else {
                    showSection(section,"completedSection");
                    showSection(section.next().next(), "openSection");
                    getNetworkProvider($icpNumber);
                    $("span.icp-result").html($icpNumber);
                    $("span.icp-summary").html($icpNumber);
                    $("#Form_SignUpForm_ICP_Number").val($icpNumber[0]);                      
                    $("#Form_SignUpForm_Cancellation_Reason").val("");
                }
                // console.log("success");
                // console.log("ICP is: " + data.result);
            })
            .fail(function() {
                // console.log("error");
                addressInput.closest('.section').after("<p class='ajax-error'>Oops, something isn't quite right. <br/>Please try entering your address again.</p>");
            })
            .always(function() {
                $(".loader").remove();
                // console.log("complete");
                isRequesting = false;
                populateAddress($this);
            });
        }  
    }


    /* 
     * Sends a request for a Network Provider based on the ICP number returned by the getICPNumber() function
     */
    function getNetworkProvider(icpNumber) {

        var $dayNightOption = $("#Form_SignUpForm_PricePlan_DayNight"),
            $dayNightNote = $dayNightOption.next().find(".note"),
            $allDayOption = $("#Form_SignUpForm_PricePlan_AllDayPrice");

        $dayNightNote.hide();

        $.ajax({
            url: $('#Form_SignUpForm_Suburb').data('api-url')+'getNetworkProvider',
            type: 'POST',
            dataType: 'json',
            data: {icp: icpNumber[0]},        
        })
        .done(function(data) {
            var $networkProvider = data.result;
            $networkSmartMeter = data.smartMeter;
            
            console.log("smart " + $networkSmartMeter);
            if ($networkProvider === "") {
                $("span.network-result").html("not found");
            }
            else {
                $("span.network-result").html($networkProvider);
                $("span.network-summary").html("Your lines provider is " + $networkProvider);
                $("#Form_SignUpForm_Network_Provider").val($networkProvider);
                console.log("Network Hidden field value is: " + $("#Form_SignUpForm_Network_Provider").val());

                if($networkSmartMeter === true) {

                    $dayNightOption.prop('checked', 'true').trigger("click");
                    $dayNightNote.hide();
                }
                else {
                    $dayNightOption.change(function() {
                        if($(this).is(":checked")){
                           $dayNightNote.show();
                        }
                    });
                    $allDayOption.change(function() {
                        if($(this).is(":checked")){
                           $dayNightNote.hide();
                        }
                    });
                }
            }
            console.log("networkProv: success");
            console.log( "Network is: " + data.result );
        })
        .fail(function() {
            console.log("networkProv: error");
            $dayNightNote.hide();
            $("span.network-result").html("not found");
        })
        .always(function() {
            console.log("networkProv: complete");
        });            
    }


    /*
     *Get user threshold
     */
    function getMonthsThresholds(billValue, billMonth) {

        var $apiSelectedHidden = $("#Form_SignUpForm_UserTypeAPISelected"); 
   
        $.get($('#Form_SignUpForm_Suburb').data('api-url')+'getMonthsThresholds', function(data) { 

        var $bill = parseFloat(billValue),
            $monthThreshhold = parseFloat(data.result[billMonth]);

            if($bill <= $monthThreshhold ){
                $apiSelectedHidden.val("Low User");
            }
            else {
                $apiSelectedHidden.val("Standard User");
            }
            $("span.usertype-summary").html($apiSelectedHidden.val());

            // console.log($apiSelectedHidden.val());

        }, 'json');      
    }


    /*
     * Hide all unchecked radio buttons in the optionset
     */
    function hideRadioButtons(optionset) {

        var $checkedRadio;
        optionset.children('li').each(function(){
           var $currentRadioWrapper = $(this);
           if($currentRadioWrapper.find('input[type=radio]').is(":checked")){
                $checkedRadio = $currentRadioWrapper;
           }
           $currentRadioWrapper.fadeOut('slow',function(){
            $checkedRadio.fadeIn("slow");
            // optionset.find('li').has('a.textLink').hide();
            optionset.find('li').has('a.textLink').fadeIn('slow');
           });
        });
    }


    /*
     * Show all radio buttons in the optionset
     */
    function showRadioButtons(optionset) {

        optionset.children('li').each(function(){
            if($(this).find('a').hasClass('textLink')){
                $(this).hide();
            }
            else {
                 $(this).fadeIn('slow');
            }
        });
    }


    /*
     * Reset the state of the radio buttons
     */
    function resetRadioButtons(optionset) {
        optionset.find("input[type=radio]").each(function(){
         $(this).prop('checked', false);
        });
    }


    /*
     * Reformats a number by padding out the number of digits and decimal places.
     */
    function formatNumber(number, digits, decimalPlaces) {
        number = number.toString();
        var simpleNumber = '';

        // Strips out the dollar sign and commas.
        for (var i = 0; i < number.length; ++i) {
            if ("0123456789.".indexOf(number.charAt(i)) >= 0)
                simpleNumber += number.charAt(i);
        }

        number = parseFloat(simpleNumber);

        if (isNaN(number))      number     = 0;
        if (digits === 0)    digits     = 1;

        var integerPart = (decimalPlaces > 0 ? Math.floor(number) : Math.round(number));
        var string = "";

        for (var i = 0; i < digits || integerPart > 0; ++i) {
            string = (integerPart % 10) + string;
            integerPart = Math.floor(integerPart / 10);
        }

        if (decimalPlaces > 0) {
            number -= Math.floor(number);
            number *= Math.pow(10, decimalPlaces);
            string += "." + formatNumber(number, decimalPlaces, 0);
        }
        return string;
    }


    /*
     * Shows the next section, with optional parameter to add .hoverSection class
     */
    function showSection(section, addSectionClass, addHover) {

        $addHoverBool = (addHover === undefined) ? true : false ;

        if(addSectionClass === "openSection") {

            section.addClass("openSection");

            if(!section.hasClass('hoverSection')){
                TweenMax.fromTo(section, 1, {css:{alpha:0,display:'block'}}, {css:{alpha:1}});
 
                    // scrollSectionIntoView(section);
              
                // TweenMax.to(section, 1, {rotationX:360, ease:Elastic.easeOut});
            }

            if($addHoverBool) {
                section.addClass("hoverSection");
            }
            resizeLi(section.find(".widthFixedLarge"));
        }

        if(addSectionClass === "completedSection") {
            section.addClass("completedSection");
            section.addClass("hoverSection");
        }
    }


    function slideDownSection(section){
        TweenMax.fromTo(section, 2, {css:{alpha:0}}, {css:{alpha:1}});
        section.slideDown(1000,"easeInSine");
        section.find('.radioWrapper').height('auto');
        resizeLi(section.find(".widthFixedLarge"));
        // scrollSectionIntoView(section);

    }


    function slideUpSection(section){
        TweenMax.fromTo(section, 1, {css:{alpha:1}}, {css:{alpha:0}});
        section.slideUp(1000,"easeOutSine");
         //resizeLi(section);
    }


    function scrollSectionIntoView (section) {
        if(section) {
            var topset = section.offset().top - 150;
            $("body,html").animate({
                scrollTop: topset
            }, 1000);
        }
    }


    function moveInnerTabs() {
        var $innerTab = $(".innerTabNav"),
            $tab1 = $("li.tab-1"),
            $tab2 = $("li.tab-2"),
            $tab3 = $("li.tab-3");

        $innerTab.append($tab2, $tab3);
        $tab2.show();
        $tab3.show();
        $innerTab.fadeIn(1000);
        $innerTab.find("li:first-child").addClass('ui-tabs-active');
    }


    // Toggle fields based on radio value of a given optionset with two options
    // For application form
    function toggleAppFields(optionset, radioValue, field) {

        optionset.find("input[type=radio]").change(function(event) {
            var $this = $(this);
            if( $this.val() === radioValue)  {
                field.show().css('display', 'table');
            }
            else {
                field.hide();
            }
        });
    }


    // Init
    $(function(){

        // Initially disable tabs
        $tabGroup.tabs("option", "disabled", [ 1, 2, 3, 4 ]);

        moveInnerTabs();
        $questionFirst = $(".section:first");
        // $questionSecond = $(".section:first").next().next();

        showSection($questionFirst, "openSection", false);
        textQuestionAnswered($questionFirst);

        toggleAppFields($(".install-optionset"), "Different to Install Address", $(".postal-address"));
        toggleAppFields($(".move-in-optionset"), "Yes", $(".move-in-date"));
        toggleAppFields($(".dog-optionset"), "Yes", $(".dog-nature"));      
    });


    /* Find optionsets and check if they have been answered
     * Hides options that havent been selected
     * Change function will show optionset fields again
     * Extra checks for special cases too
     */
    $("#Sign_up .section").not('.section.application').each(function(){

        //the current section
        var $section = $(this),
        $nextSection = $section.next(),
        $stopFormBlock = $(".stopFormBlock");


        $section.find('ul.qOptions').not("#Form_SignUpForm_SchoolLevel").each(function(){

            // The current optionset
            var $optionset = $(this);

            // Generic function to show next section after a radio button is clicked
            $optionset.find("input[type=radio], input[type=checkbox]").change(function() {

                if($(this).is("input[type=radio]")){
                    hideRadioButtons($optionset);
                }
                showSection($section, "completedSection");
                if($nextSection.hasClass('section')) {
                    showSection($nextSection, "openSection");
                }
                
                if ($nextSection.hasClass('ctaSection')){
                    enableContinue(2);
                }
            });


            // Bind the ability to show all options again in optionset
            $optionset.find('li a.textLink').click(function(e) {
                e.preventDefault();
                showRadioButtons($optionset);
            });


            // Checks for promo code
            if($optionset.is('#Form_SignUpForm_PulsePromotionCode')) {
                var $codeEntryBlock = $section.find(".innerSection"),
                    $codeSuccessMessage = $codeEntryBlock.find(".codeSuccess"),
                    $promoInput = $codeEntryBlock.find("input[type=text]"),
                    $promoSubmit = $codeEntryBlock.find(".promoSubmit");

                $optionset.find("input[type=radio]").change(function(event) {
                   
                    hideRadioButtons($optionset);
                    
                    if($(this).val() == "Yes") { 
                        $section.removeClass('completedSection').addClass('multiSection');
                        slideDownSection($codeEntryBlock);
                        // $nextSection.removeClass("openSection").removeClass('hoverSection');
                        // $nextSection.attr("style", "");
                    }
                    else {
                        slideUpSection($codeEntryBlock);
                        showSection($section, "completedSection");
                        showSection($nextSection, "openSection");
                        $promoSubmit.fadeIn(700);
                        $codeSuccessMessage.fadeOut(1000);
                        $promoInput.val("");
                    }
                }); 

                $promoSubmit.click(function(e) {
                    e.preventDefault();
                    if ($promoInput.val() !== "") {
                        $codeSuccessMessage.slideDown(1000, function() {
                            $promoSubmit.fadeOut(700);  
                            showSection($section, "completedSection");
                            showSection($nextSection, "openSection");                          
                        });
                    }                    
                });        
            }

            // Checks for ICP number and controls progress to next tab
            if($optionset.is('#Form_SignUpForm_CustomerICPNumber')) {

                $optionset.find("input[type=radio]").change(function(event) {
                    hideRadioButtons($optionset);
                    showSection($section, "completedSection");

                    if( $(this).val() === "No") { 
                       // Stop the form
                       disableContinue(1);
                       slideDownSection($stopFormBlock);  
                       $("#Form_SignUpForm_Cancellation_Reason").val("ICP isn't correct");      
                    }
                    else {
                        // carry on
                        enableContinue(1); 
                        if( $stopFormBlock.is(":visible")){
                           slideUpSection($stopFormBlock);     
                        }                                          
                    }
                }); 
            }

            // Extra checks for school search optionset
            if($optionset.is('#Form_SignUpForm_PulseSchool')) {

                //Block that holds the search input
                var $schoolSearchBlock = $section.find(".innerSection"),
                $schoolNotFound = $schoolSearchBlock.next().find(".notFound"),
                $schoolNotFoundMessage = $schoolSearchBlock.next().find(".submitMessage");


                $optionset.find("input[type=radio]").change(function(event) {
                    if($(this).val() == "Yes") {
                        $section.removeClass('completedSection').addClass('multiSection');
                        if(!$nextSection.hasClass('completedSection')){
                            //$nextSection.removeClass('openSection').removeClass('hoverSection').fadeOut('fast');
                        }
                        slideDownSection($schoolSearchBlock);
                    }
                    else {
                        slideUpSection($schoolSearchBlock);
                        slideUpSection($schoolNotFound);
                        slideUpSection($schoolNotFoundMessage);
                        $("#Form_SignUpForm_School").val("");
                        $section.removeClass('multiSection');
                    }
                });

                // Shows the block where user can enter manual details about school is the autocomplete
                // doesn't bring back a suitable result
                $schoolSearchBlock.find('a.textLink').click(function(e) {
                    e.preventDefault();
                    slideDownSection($schoolNotFound);
                    // $nextSection.removeClass('openSection').fadeOut('fast');

                    $section.removeClass('completedSection');
                    $("#Form_SignUpForm_School").val("");
                    $schoolNotFound.find("input[type=text]").val("");
                    $schoolNotFound.find('input[type=checkbox]:checked').removeAttr('checked');
                });


                /* Controls the psuedo-form that is filled and submitted when the school search fails
                 * Performs validation to ensure fields are not blank
                 * Shows the submission message
                 */
                $schoolNotFound.find('a.btn').click(function(e) {
                    e.preventDefault();
                    var $schoolName = $schoolNotFound.find("#Form_SignUpForm_SchoolName"),
                    $schoolRadios = $schoolNotFound.find('.radio');

                    $section.removeClass('completedSection');

                    // Add a rule for validation of the manual school name input
                    $schoolName.rules( "add", {
                        required: true,
                        minlength: 4,
                        messages: {
                           required: "A school name is required",
                           minlength: jQuery.format("Oops! At least {0} characters are necessary")
                        }
                    });

                    // Add a rule for school level optionset/radios
                    $schoolRadios.rules("add", {
                        required: function (element) {
                                    var checks = $schoolRadios;
                                    if (checks.filter(':checked').length === 0) {
                                        return true;
                                    }
                                        return false;
                                },
                                minlength: 1,
                                messages: {
                                    required: "Please select a school level"
                                }

                    });

                    // Validate input
                    $schoolName.valid();
                    $schoolRadios.valid();

                    //Move the label since it gets attached to the input
                    $schoolNotFound.find(".valPrimary label.error").appendTo($schoolNotFound.find(".checkboxset"));

                    // Show submission message and continue to the next question/section
                    if($schoolName.valid() && $schoolRadios.valid()){
                        //$schoolSearchBlock.find('a.textLink').unbind('click');
                        slideUpSection($schoolNotFound);
                        slideDownSection($schoolNotFoundMessage);
                        showSection($section, "completedSection");
                        showSection($nextSection, "openSection");
                    }
                });

                // Force selection from the list of schools, otherwise clear the input
                $("#Form_SignUpForm_School").on("autocompletechange", function(event, ui) {
                    if(!ui.item){
                        $("#Form_SignUpForm_School").val("");
                    }
                    else {
                        slideUpSection($schoolNotFound);
                        showSection($section, "completedSection");
                        showSection($nextSection, "openSection");
                    }
                }).on( "autocompletefocus", function( event, ui ) {
                    return false;
                });
            }


            // Controls the flow of final question
            if($optionset.is('#Form_SignUpForm_SmoothPay')) {

                var $smoothpayFreq = $section.find('.innerSection'),
                $smoothpayFreqOptionset = $smoothpayFreq.find('ul.qOptions');

                $optionset.find("input[type=radio]").change(function() {

                    $smoothOp = $(this);
                    if($smoothOp.val() == "No") {
                        enableContinue(3);
                        slideUpSection($smoothpayFreq);
                        resetRadioButtons($smoothpayFreqOptionset);
                        showRadioButtons($smoothpayFreqOptionset);
                        $section.removeClass('multiSection');
                    }
                    else {
                        disableContinue(3);
                        $section.addClass('multiSection').removeClass('completedSection');
                        slideDownSection($smoothpayFreq);
                    }
                 });
            }

            if($optionset.is('#Form_SignUpForm_SmoothPayFrequency')) {
                $optionset.find("input[type=radio]").change(function() {
                    enableContinue(3);
                });
            }
        });


        /* Electricity Usage Question (Tab 2)
         * Special case for question with two inputs (a text input and select input)
         */
        if($section.hasClass('textFieldsOnly')) {

            var $billValue = $section.find("input[type=text]"),
                $billMonth = $section.find("select"),
                $billValueNumber = 0;

            // Add currency formatting
            $billValue.blur(function(event) {
                if ($billValue.val() !== ""){
                    $billValue.val('$' + formatNumber($billValue.val(), 0, 2));
                }               
            });
            // The allows progression only if both inputs have user added values
            $section.find("select, input").change(function() {
                $billValueNumber = $billValue.val().replace('$', '');
                //console.log("Bill Value Number: " + $billValueNumber);
                //console.log("A: " + $billValue.val() + " B: " + $billMonth.val());               
                if( $billValueNumber > 0 && $billMonth.val() !=="placeholder") {
                    showSection($section, "completedSection");
                    showSection($nextSection, "openSection");
                    $nextSection.next().fadeIn('slow');
                    enableContinue(2);

                    getMonthsThresholds($billValueNumber, $billMonth.val());
                    // showSection($nextSection.next(), "openSection");

                }
            });
        }

        $section.find("#Form_SignUpForm_Suburb").each(function(){

            $addressInput = $(this);

            widget.on("result:select",function(value,data){
                $addressInput.val(value);
                console.log($addressInput.val());
                getICPNumber($addressInput,$section);
                $addressInput.trigger("change");

            });

            $addressInput.blur(function(){               
                $(this).delay(1000).queue(function(){
                    // console.log("blur delay");
                    getICPNumber($addressInput,$section);
                    $(this).dequeue()
                });
                console.log(isRequesting);
            });
        });
    
        
        /* Keeps the white highlight on the section when focus is on a text input
         * Highlight removed when focuses out  (goes back to only on hover)
         */
        $section.find("input[type=text]").each(function(){
            $thisInput = $(this);
            $thisInput.focus(function(event) {
                $section.removeClass("hoverSection");
            }).focusout(function(event) {
                $section.addClass("hoverSection");
            });
        });
    });


    $(".stopFormSubmit").click(function(e) {
        //e.preventDefault();

        var $stopFormBlock = $(".stopFormBlock"),
            $custPhone = $stopFormBlock.find("input[type=text]"),
            $timeToCall = $("#Form_SignUpForm_BestTimeToContact"),
            $form = $(this).closest('form');

        console.log($timeToCall.val());

        $custPhone.rules( "add", {
            required: true,
            minlength: 6,
            messages: {
                required: "A phone no is required",
                minlength: jQuery.format("Oops! At least {0} characters are necessary")
            }
        });

        // add the rule here
        $.validator.addMethod("valueNotEquals", function(value, element, arg){
          return arg != value;
        }, "Value must not equal arg.");

         // configure your validation
         $form.validate().form();
         

        if( $custPhone.val() === "" || $timeToCall.val() === "") {
            return false;
        }

    });
    
    $(".resetBtn").click(function(e) {
        e.preventDefault();
        location.reload();
    });

    $(".btnCancel").click(function(e) {
        e.preventDefault();
        slideDownSection($(".stopFormBlock"));
        $("#Form_SignUpForm_Cancellation_Reason").val("Ended in application");
    });
    
    
// ==========================================================================
//                              TABS
// ==========================================================================


    // Hide the controls box
    function hideControls() {
        $(".controls").hide();
    }


    // Enable the continue button and given tab
    function enableContinue(tab) {
        $tabGroup.tabs( "enable", tab);
        $(".nextTab").removeClass('disabled');

    }


    // Disable the continue button and given tab
    function disableContinue(tab) {
        $tabGroup.tabs( "disable", tab);
        $(".nextTab").addClass('disabled');
        console.log("disabled");
    }


    // Allows the passed in custom ddl/select to be reset programatically
    // This includes both the custom ddl view, and the underlying hidden select
    function resetSelect(ddl) {
        ddl.find("option").each(function() {
            if($(this).val() === "placeholder"){
                $(this).prop("selected", true);
                $(this).parent().parent().find(".ddl").html($(this).html() + ' <span class="ddl-arrow"></span>');
            }
            else{
                $(this).prop("selected", false);
            }
        });
    }   


    var $yHome = $(".tab").first(),
        $yPrice = $yHome.next(),
        $pOptions = $yPrice.next(),
        $sSummary = $pOptions.next(),
        $aForm = $sSummary.next(),
        $tabGroup = $("#Sign_up");


    // $tabGroup.on( "tabsbeforeactivate", function( event, ui ) {
    //     $(".nextTab").removeClass('disabled');
    //     console.log("step is " + ui.newTab.index());
    //     window.location.hash = "/step"+ (ui.newTab.index()+1);
    //     return true;
    // });

    // var app = $.sammy(function() {
    //     this.get("#/step:index", function(context){
    //         $tabGroup.tabs("option","active",(parseInt(this.params["index"],10))-1);
    //     });
    // });

    // app.run();


    $(".buildPlanInner").click(function(event) {
       $tabGroup.tabs("option", "active", 0 );
    });
    

    // Add functionaility to the continue button
    $(".nextTab").click(function(e) {
        e.preventDefault();
        if(!$(this).hasClass('disabled')){
            var $active = $("#Sign_up").tabs( "option", "active" );

            // Check if we navigating to the final application form tab
            if($active === 3) {
                $tabGroup.tabs( "enable", 4);
                $(".section.application").fadeIn("slow");  
                $(this).removeClass('disabled');              
            }

            $tabGroup.tabs("option", "active", $active + 1 );
            

            //Continue button always enabled on summary tab
            if($active === 2) { 
                $(this).removeClass('disabled'); 
            }
            else {
                $(this).addClass('disabled');
            }

            // if($active < 2){
            //     $(this).addClass('disabled');
            // }
            // else {
            //     $(this).removeClass('disabled');
            // }            
         }
    });


    // Reset and resize li's to match in row when tab is activated
    // Two functions may also need to be called when transitioning from one question to another
     $tabGroup.on( "tabsactivate", function( event, ui ) {
        var $firstSectionInTab = ui.newPanel.find('.openSection'),
            $tabNav = $(".tabNav"),
            $innerTabNav = $(".innerTabNav");

        showSection($firstSectionInTab, "openSection", false);
        var $active = $("#Sign_up").tabs( "option", "active" );
        if($active === 4) {
            $(".Actions").show();
             $(".controls").hide();
        }
        else {
            $(".Actions").hide();
            $(".controls").show();
        }

        if($active === 3) {
            $(".nextTab").removeClass('disabled');
        }

        //Add active styling to first tab when inner tabs are active
        if($active < 3) {
            $tabNav.find("li:first-child").addClass("ui-tabs-active");
        }
        else {
            $tabNav.find("li:first-child").removeClass("ui-tabs-active");
        }

        if($active === 0) {
            $innerTabNav.find("li:first-child").addClass('ui-tabs-active');
        }
        else {
           $innerTabNav.find("li:first-child").removeClass('ui-tabs-active'); 
        }

        // Only show inner tabs navigation in the "Build Your Plan" section
        if ($active > 2)
             $innerTabNav.hide();
        else 
             $innerTabNav.show();

           // var disabled = $("#Sign_up").tabs( "option", "disabled" );

        // console.log(disabled);

     });
   

/*======================== TESTING/ OLD CODE FOR REFERENCE ============================*/




    /*
     * Controls the ability for the user to proceed from the first tab
     * once all questions have been answered
     */
    // var $yPriceFirstQUestion = $yPrice.find(".section:first-child"),
    // $billValue = $yPriceFirstQUestion.find("input[type=text]"),
    // $billMonth = $yPriceFirstQUestion.find("select");

    // // Add currency formatting
    // $billValue.blur(function(event) {
    //     if ($billValue.val() !== ""){
    //         $billValue.val('$' + formatNumber($billValue.val(), 0, 2));
    //     }

    // });

    // // The allows progression only if both inputs have user added values
    // $yPriceFirstQUestion.find("select, input").change(function() {
    //     // console.log("A: " + $billValue.val() + " B: " + $billMonth.val());
    //     if($billValue.val() !=="$0.00" && $billValue.val() !=="" && $billMonth.val() !=="placeholder") {
    //         showSection($yPriceFirstQUestion, "completedSection");
    //         //enableContinue(1);
    //     }
    // });



   // var $optionalQuestion = $cUsage.find(".section:last-child"),
    // $optionalSelectA = $optionalQuestion.find("#Form_SignUpForm_BillSize"),
    // $optionalSelectB = $optionalQuestion.find("#Form_SignUpForm_Ave_or_byMonth"),
    // $prevOptionset = $("#PowerUsage").find("ul.optionset");

    // // Disabled or enables the user to progress to the next tab
    // $prevOptionset.find("input[type=radio]").change(function() {

    //     // Check for the "not sure" option and disable progression
    //    if($(this).val() === "Not Sure") {
    //     disableContinue(1);
    //    }
    //    // Otherwise a valid answer is selected that allows progression
    //    // We reset the ddls just in case the user has returned from answering the optional question
    //    else {
    //     enableContinue(1);
    //     resetSelect($optionalSelectA);
    //     resetSelect($optionalSelectB);
    //    }
    // });

    // // The optional question allows progression only if both selects have a valid option chosen
    // $optionalQuestion.find("select").change(function() {
    //     console.log("A: " + $optionalSelectA.val() + " B: " + $optionalSelectB.val());
    //     if($optionalSelectA.val() !="placeholder" && $optionalSelectB.val() !="placeholder") {
    //         enableContinue(1);
    //     }
    // });



    // $tabGroup.on("tabsactivate", function( ev, ui ) {
    //      location.href =   "#/ui.newTab/" + $(this).attr("id");
    //      console.log("ndfjks");
    //     return true;

    //  });

    // $tabGroup.ontabs({activate: function(ev, ui) {
    //   location.href =   "#/ui.tabs/"
    //   + $(this).attr("id")
    //   + "/" + ui.index;
    //   return true;
    //   console.log("ndfjks");
    // }});

    // var app = $.sammy(function() {
    //     this.get("#/ui.newTab/:id", function(context){

    //         // $("#" + this.params["id"])
    //         // .on("tabsactivate",parseInt(this.params["index"],10));



    //     });
    // });

    // app.run("sign-up#/");


// });





});