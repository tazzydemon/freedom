$(document).ready(function () {

    /*
     * Stop form submmiting by pressing Enter
     */
    $('input[type=text], select').keypress(function (event) {
        return event.keyCode != 13;
    });


    /*
     * Initialise a new AddressFinder and customise for searching suburbs only
     */
    if (document.getElementById('Form_SignUpForm_Suburb')) {
        var widget = new AddressFinder.Widget(document.getElementById('Form_SignUpForm_Suburb'), "V3YULPXNHT49F8BCE7DG",
                {
                    manual_style: true,
                    empty_content: "",
                    empty_class: "af_empty",
                    show_addresses: true,
                    show_locations: false,
                    address_params: {
                        street: 1,
                        city: 1,
                        region: 1
                    }
                });


        /*
         * Initialise a new AddressFinder and customise for searching suburbs only
         */
        var schoolWidget = new AddressFinder.Widget(document.getElementById('Form_SignUpForm_School'), "V3YULPXNHT49F8BCE7DG",
                {
                    manual_style: true,
                    show_addresses: true,
                    show_locations: false,
                    address_params: {
                        street: 1,
                        city: 1,
                        region: 1
                    }
                });
        schoolWidget.addService('schools', function (query, response_fn) {
            //call jQuery getJSON request to external API
            var schoolURL = $('#Form_SignUpForm_Suburb').data('api-url') + 'getSchool';
            $.getJSON( schoolURL, {maxRows: 12, name_startsWith: query }, function (data) {
                if (data && data.schools) {

                    //format results
                    var results = $.map(data.schools, function (result) {
                        return {
                            value: result.SchoolName,
                            score: null,
                            data: result
                        };
                    });
                    //return results in response_fn callback
                    response_fn(query, results);
                }
            });
        });
    }


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
    function populateAddress(address, data) {
        //  console.log('popadress');
        //  console.log(data);
//        var inputText = address.val();
//console.log('raw'+ address.val());
//        var re = new RegExp(",");
//        var ar = inputText.split(re);
//console.log(ar);
//        if (ar.length == 4) {
//            ar[0] = ar[0] + ',' + ar[1];
//            ar[1] = ar[2];
//            ar[2] = ar[3];
//        }
//
//        if (ar[0] && ar[1] && ar[2]) {
//            $('#Form_SignUpForm_Application_HouseNumberAndStreetName').val(ar[0].trim());
//            $('#Form_SignUpForm_Application_Suburb').val(ar[1].trim());
//            $('#Form_SignUpForm_Application_City').val(ar[2].trim());
//        }
        //console.log('House Number and Street Name: '+ar[0]);console.log('Suburb: '+ ar[1]);console.log('City: '+ ar[2]);//Debugging
        var unitSeparator = (data.unit_identifier) ? '/' : '';
        //console.log(unitSeparator);
        var houseNumberAndStreetName = (data.unit_identifier || '') + unitSeparator + (data.number || '') + ' ' + (data.alpha || '') + ' ' + (data.street || '');
        //console.log(houseNumberAndStreetName)
        $('#Form_SignUpForm_Application_HouseNumberAndStreetName').val(houseNumberAndStreetName.trim());
        $('#Form_SignUpForm_Application_Suburb').val((data.suburb || ''));
        $('#Form_SignUpForm_Application_City').val((data.city || '') + ' ' + (data.postcode || '') + ', ' + (data.region || ''));
    }


    /* Check to see if an textfield type question has been answered
     * Shows the next section if requirements are met
     */
    function textQuestionAnswered(section) {
        section.find("input[type=text]").keyup(function () {
            var $this = $(this);
            var $inputText = $this.val().replace(/\s+/g, '');

            if ($inputText.length >= 3) {
              //  console.log(' showsection - text quest > 3');
              //  console.log(section);
                showSection(section, "completedSection");
                showSection(section.next(), "openSection");
              //  console.log($('#Form_SignUpForm_PulsePromotionCodeValue').prop('defaultValue'));
                if($('#Form_SignUpForm_PulsePromotionCodeValue').prop('defaultValue') == 'TGNZES1508'){
                    showSection(section.next(), "completedSection");
                    slideUpSection($('.promoCodeSection'));
                    //$('.promoSubmit').hide();
                    showSection(section.next().next(), "openSection");
                    $('#Form_SignUpForm_PulsePromotionCodeValue').val('TGNZES1508').trigger('change');
                    //console.log(my);
                    //$('#Form_SignUpForm_PulsePromotionCode_No').attr('checked', true);
                    //console.log($('#Form_SignUpForm_PulsePromotionCodeValue').val());
                    //my.promotionCodeValue('TGNZES1508'); //directly trigger ko view

                    //$('#Form_SignUpForm_PulsePromotionCode').trigger('change');
                }
            }
            if ($this.is(':focus')) {
                section.removeClass('hoverSection');
            }
        }).blur(function () {
            var $this = $(this);
            if ($this.val().length >= 3) {
                //console.log('showsection - text quest blur 125');
                //console.log(section);
                showSection(section, "completedSection");
//                console.log('showsection next - text quest blur 127');
//                console.log(section.next());
                showSection(section.next(), "openSection");
                if($('#Form_SignUpForm_PulsePromotionCodeValue').val() == 'TGNZES1508'){
                    showSection(section.next(), "completedSection");
                    slideUpSection($('.promoCodeSection'));
                    //$('.promoSubmit').hide();
                    showSection(section.next().next(), "openSection");
                    $('#Form_SignUpForm_PulsePromotionCodeValue').val('TGNZES1508').trigger('change');
                    //$('#Form_SignUpForm_PulsePromotionCodeValue').trigger('change');
                    //my.promotionCodeValue('TGNZES1508'); //directly trigger ko view
                }

            }
        });
    }


    /* Sends a request for an ICP Number based on entered address
     * Shows the next section if requirements are met, otherwise stop the form/flow
     */
    function getICPNumber(addressInput, section, data) {
        //console.log('getICPNumber');
        //console.log(addressInput.val());
        //console.log($('#Form_SignUpForm_Suburb').data('api-url'));
        var $this = addressInput;
        var $waitIndicator = '<div class="loader"><img src="themes/pulse-signup/images/non-sprite/ajax-loader.gif" class="loaderimg"></div>';
        var myjson_data = JSON.stringify(data, null, 0);
        //console.log(myjson_data);
        if ($this.val() && isRequesting === false) {
            $.ajax({
                url: $('#Form_SignUpForm_Suburb').data('api-url') + 'getICPNumber',
                type: 'POST',
                dataType: 'json',
                // data: {
                data: {
                    json_data: myjson_data,
                    address: addressInput.val(),
                    // unitOrNumber: data['number'],
                    // streetOrPropertyName: data['street'],
                    // suburbOrTown: data['suburb'],
                    // region: data['region']
                },
                beforeSend: function () {
                    $(".ajax-error").remove();
                    addressInput.closest('.section').after($waitIndicator);
                    isRequesting = true;
                    //console.log("REQUEST IS SENT");
                },
            })
                    .done(function (data) {
                       // console.log('done');
                       // console.log(data);
                        var icpNumber = data.result;
                        var regAddress = data.address;

                        if (($.isEmptyObject(icpNumber)) || (icpNumber == 'null')) {  // null is actually sent in json to avoid)
//                            console.log('geticp slidedown stop section');
//                            console.log($(".stopFormBlock"));
                            slideDownSection($(".stopFormBlock"));
//                            console.log('geticp slideupsection');
                            slideUpSection(section.next().next()); //get rid of icp result section if the address has been changed to a BAD one

//                            console.log('geticp fail slidedown icpsubmit  180');
//                            console.log(section.next().next());
                            //new argument at end to stop it actually showing. trying to slide up afterwards caused race issues
                            showSection(section.next().next(), "openSection", true, true); //open it then hide it to manually inpout icp (otherwise this is icpDisplaySection)


                            //                    slideUpSection(section.next().next())}, 20); //ready to manually input icp (otherwise this is icpDisplaySection)

                            //show
                            slideDownSection($('.icpSubmitSection'));
                            slideDownSection($('.missingICPSection'))

                            //hide
                            slideUpSection($(".businessSection"));
                            slideUpSection($('.icpDisplaySection')); // dont make this first or a race will occur


                            $('.section #Form_SignUpForm_CustomerICPNumber').show(); //bring choice back if manual icp number entered
                            $('.section #Form_SignUpForm_CustomerICPNumber').parent().siblings('p').show();

                            $("span.icp-result").html("");
                            $("#Form_SignUpForm_Cancellation_Reason").val("Can't Find ICP");
                            // log("ICP NOT FOUND");
                        }
                        else {
//                            console.log('geticp slideup stop section');
//                            console.log($(".stopFormBlock"));

                            //hide
                            slideUpSection($(".stopFormBlock")); // included as the address has been corrected
                            slideUpSection($(".businessSection"));
                            slideUpSection($('.icpSubmitSection'));


                            $("#Form_SignUpForm_Cancellation_Reason").val("");
//                            console.log('geticp showsection');
//                            console.log(section);
                            showSection(section, "completedSection");
//                            console.log('geticp showsection')
//                            console.log(section.next().next());
                            showSection(section.next().next(), "openSection");
                            getNetworkProvider(icpNumber);


//                            if (!($.isEmptyObject(regAddress))) {
//                                var icpTable = "<span class=\"icp-display table-layout full\"><span class=\"table-row\"><span class=\"table-cell middle green\">Your ICP Number</span><span class=\"table-cell middle\">xicpNumber</span></span></span>"
//                                                +"<span class=\"icp-display table-layout full\"><span class=\"table-row\"><span class=\"table-cell middle green\">The Electricity Registry Address for this ICP number</span><span class=\"table-cell middle\">xicpAddress</span></span></span>"
//                                var icpAddress =""
//                                icpAddress += (regAddress[0].unit) ? " " + regAddress[0].unit.toLowerCase().toTitleCase() + " / " : '';
//                                icpAddress += (regAddress[0].propertyName) ? regAddress[0].propertyName.toLowerCase().toTitleCase() + ", " : '';
//                                icpAddress += (regAddress[0].number) ? regAddress[0].number.toLowerCase().toTitleCase() + " " : '';
//                                icpAddress += (regAddress[0].street) ? regAddress[0].street.toLowerCase().toTitleCase() + ",<br/>" : '';
//                                icpAddress += (regAddress[0].suburb) ? regAddress[0].suburb.toLowerCase().toTitleCase() + ", " : '';
//                                icpAddress += (regAddress[0].town) ? regAddress[0].town.toLowerCase().toTitleCase() + ", " : '';
//                                icpAddress += (regAddress[0].vRegion) ? regAddress[0].vRegion.toLowerCase().toTitleCase() + " Region" : '';
//                                icpAddress += '';
//
//                                //console.log('regAddress');
//                                //console.log(regAddress);
//                                $("span.icp-result").html(icpTable.replace('xicpNumber', icpNumber).replace('xicpAddress', icpAddress));
//
//                            }
//                            else {
//                                $("span.icp-result").html(icpNumber);
//                            }
//                            $("span.icp-summary").html(icpNumber);
//                            $("#Form_SignUpForm_ICP_Number").val(icpNumber[0]);
//                            $("#Form_SignUpForm_Cancellation_Reason").val("");
                        }
                        // console.log("success");
                        // console.log("ICP is: " + data.result);
                    })
                    .fail(function (data) {
                        //console.log('faildata');
                       // console.log(data);
                        addressInput.closest('.section').after("<p class='ajax-error'>Oops, something isn't quite right. <br/>Please try entering your address again.</p>");
                    })
                    .always(function () {
                        $(".loader").remove();
                        // console.log("complete");
                        isRequesting = false;
                        populateAddress($this, data);
                    });
        }
    }


    /* 
     * Sends a request for a Network Provider based on the ICP number returned by the getICPNumber() function
     */
    function getNetworkProvider(icpNumber) {

        var $dayNightOption = $("#Form_SignUpForm_PricePlan_DayNight"),
                $dayNightNote = $dayNightOption.next().find(".note.yes"),
                $dayNightNote1 = $dayNightOption.next().find(".note.not"),
                $allDayOption = $("#Form_SignUpForm_PricePlan_AllDayPrice"),
                $allDayNote = $allDayOption.next().find(".note");


        $dayNightNote.hide();
        $dayNightNote1.hide();

        $.ajax({
            url: $('#Form_SignUpForm_Suburb').data('api-url') + 'getNetworkProvider',
            type: 'POST',
            dataType: 'json',
            data: {icp: icpNumber[0]},
        })
                .done(function (data) {
//                    console.log('getNetworkProvider Ajax data return');
//                    console.log(data);
                    var $network = {"ALPE": "Alpine Energy", "AMPC": "AMP Capital Investors", "BCRO": "Body Corporate 169769", "BUEL": "Buller Electricity", "CHBP": "Centralines", "CKHK": "Electricity Wellington Lines", "COUP": "Counties Power", "DELT": "Delta Utility Services", "DUNE": "Aurora Energy", "DUNW": "Trustpower (Waipori)", "EASH": "Electricity Ashburton", "EAST": "Eastland Network", "ELEC": "Electra Lines", "ELIN": "Electricity Invercargill", "ENSL": "Embedded Network Services", "GNET": "GasNet Meters", "HAWK": "Unison", "HEDL": "Horizon Energy", "KIPT": "Kiwi Income Property Trust", "LINE": "The Lines Company", "LLNW": "Lakeland Network", "MARL": "Marlborough Lines", "MPOW": "MainPower NZ", "MRPL": "Mighty River Power", "NELS": "Nelson Electricity", "NOVA": "Nova Gas", "NPOW": "Northpower", "NZST": "BHP NZ Steel", "ORON": "Orion NZ", "OTPO": "Otago Power", "PANP": "Pan Pacific Forrestry", "POCO": "Powerco", "SCAN": "Scanpower", "TANZ": "TransAlta", "TASM": "Network Tasman", "TOPE": "Top Energy", "TPCO": "The Power Company", "UNET": "United Networks", "VECT": "Vector", "WAIK": "WEL Networks", "WAIP": "Waipa Networks", "WATA": "Waitaki Networks", "WFNZ": "Westfield NZ", "WKHK": "Wellington Electricity Lines", "WPOW": "Westpower", "POCV": "Powerco", "POCA": "Powerco", "POCB": "Powerco", "POCT": "Powerco", "HAWR": "Unison", "HAWT": "Unison", "DUNC": "Aurora Energy", "DUNF": "Aurora Energy", "POCO": "Powerco", "HAWK": "Unison"};
                    // var obj = JSON.parse(json);
                    var $networkProvider = $network[data.result];
                    $networkSmartMeter = data.smartMeter;
//                    console.log(data.meterDetailArray);
//                    console.log(JSON.stringify(data.meterDetailArray));
//                    console.log("smart " + $networkSmartMeter);
                    if ($networkProvider === "") {
                        $("span.network-result").html("not found");
                    }
                    else {
                        $("span.network-result").html($networkProvider);
                        $("span.network-summary").html("Your Lines Company is " + $networkProvider);
                        $("#Form_SignUpForm_Network_Provider").val($networkProvider);
                        //                       console.log("Network Hidden field value is: " + $("#Form_SignUpForm_Network_Provider").val());

                        //new place for address

                        $regAddress = data.address;
//                        console.log($regAddress[0]);

                        if (!($.isEmptyObject($regAddress[0]))) {
                            var icpTable = "<span class=\"icp-display table-layout full\"><span class=\"table-row\"><span class=\"table-cell middle green\">Your ICP Number</span><span class=\"table-cell middle\">xicpNumber</span></span></span>"
                                    + "<span class=\"icp-display table-layout full\"><span class=\"table-row\"><span class=\"table-cell middle green\">The Electricity Registry Address for this ICP number</span><span class=\"table-cell middle\">xicpAddress</span></span></span>"
                            var icpAddress = ""
                            icpAddress += ($regAddress[0].unit) ? " " + $regAddress[0].unit.toLowerCase().toTitleCase() + " / " : '';
                            icpAddress += ($regAddress[0].propertyName) ? $regAddress[0].propertyName.toLowerCase().toTitleCase() + ", " : '';
                            icpAddress += ($regAddress[0].number) ? $regAddress[0].number.toLowerCase().toTitleCase() + " " : '';
                            icpAddress += ($regAddress[0].street) ? $regAddress[0].street.toLowerCase().toTitleCase() + ",<br/>" : '';
                            icpAddress += ($regAddress[0].suburb) ? $regAddress[0].suburb.toLowerCase().toTitleCase() + ", " : '';
                            icpAddress += ($regAddress[0].town) ? $regAddress[0].town.toLowerCase().toTitleCase() + ", " : '';
                            icpAddress += ($regAddress[0].vRegion) ? $regAddress[0].vRegion.toLowerCase().toTitleCase() + " Region" : '';
                            icpAddress += '';

//                            console.log('icpAddress');
                            //                           console.log(icpAddress);
                            $("span.icp-result").html(icpTable.replace('xicpNumber', icpNumber).replace('xicpAddress', icpAddress));

                            slideUpSection($(".stopFormBlock"));
                            slideDownSection($('.icpDisplaySection'));
                            slideUpSection($(".missingICPSection"));

                            $('#Form_SignUpForm_CustomerICPNumber_Yes').attr('checked', false);

                            $('#Form_SignUpForm_CustomerICPNumber').show();
                            $('.section #Form_SignUpForm_CustomerICPNumber').show(); //bring choice back if manual icp number entered
                            $('.section #Form_SignUpForm_CustomerICPNumber').parent().siblings('p').show();

                            //                        console.log('meterDetailArray');
                            //                        console.log(data.meterDetailArray);
                            if ((data.meterDetailArray != null) && data.meterDetailArray.length >= 1) {
                                var PDFhtml = '<span class=\"price-display table-layout full\">'
                                        + '<span class=\"table-row\"><span class=\"table-cell middle green\">Meter Number</span>'
                                        + '<span class=\"table-cell middle green\">Meter Type</span><span class=\"table-cell middle green\">Price List</span></span>';
                                for (i = 0; i < data.meterDetailArray.length; i++) {
                                    var even = 'even';
                                    if (i > 0) {
                                        even = (i % 2 == 0) ? 'even' : 'odd';
                                    }
                                    PDFhtml += '<span class=\"table-row ' + even + '\">'
                                            + '<span class=\"table-cell middle\">' + data.meterDetailArray[i][4] + '</span><span class=\"table-cell middle\">' + data.meterDetailArray[i][3] + '</span>'
                                            + '<span class=\"table-cell middle\"><a class=\"btn btnMed blue\" href=\"/assets/Uploads/pricing-pdf/' + data.meterDetailArray[i][2] + '.pdf\" target=\"_blank\">View</a></span>'
                                            + '</span>';
                                }
                                PDFhtml += '</span>';

                                $("label[for='Form_SignUpForm_PricePlan_AllDayPrice'] .labelStd").html(PDFhtml);
                                $("label[for='Form_SignUpForm_PricePlan_DayNight'] .labelStd").html(PDFhtml);
                                //slideDownSection($('.section').has('#Form_SignUpForm_CustomerICPNumber')); //make icp result section appear if previosuly hidden by meter issue
                                // disable day night pricing (suspended)
                                // $('.valDay_Night > label').attr('for','Form_SignUpForm_PricePlan_DayNight_disabled');

                                //section slide area in case we have come from just an ICP box
                                slideUpSection($(".stopFormBlock"));
                                slideDownSection($(".icpDisplaySection"));

                                $('#Form_SignUpForm_CustomerICPNumber').show();
                                $('.section #Form_SignUpForm_CustomerICPNumber').show(); //bring choice back if manual icp number entered
                                $('.section #Form_SignUpForm_CustomerICPNumber').parent().siblings('p').show();

                                resizeLi($('.pricePlaceSection').find(".widthFixedLarge"));


                            }
                            else {// no useful meters found - it might be commercial. Phone call required

                                slideDownSection($(".icpDisplaySection"));
                                slideUpSection($(".missingICPSection"));
                                slideDownSection($(".businessSection"));
                                //                            console.log('hide icp correct choice');//slideDownSection($(".icpSubmitSection"));
                                //                            $('.section #Form_SignUpForm_CustomerICPNumber').hide();
                                slideDownSection($(".stopFormBlock"));
                                $('.section #Form_SignUpForm_CustomerICPNumber').hide(); //bring choice back if manual icp number entered
                                $('.section #Form_SignUpForm_CustomerICPNumber').parent().siblings('p').hide();
                                //$('.section #Form_SignUpForm_CustomerICPNumber').hide(); //get rid of icp result section
                                //$('.section #Form_SignUpForm_CustomerICPNumber').parent().siblings('p').hide();

                                $("#Form_SignUpForm_Cancellation_Reason").val("Can't Find Domestic Meter");
                                // console.log("ICP NOT FOUND");
                            }

                            $("#Form_SignUpForm_Cancellation_Reason").val("");
                        }
                        else {
                            $("span.icp-result").html('The ICP Number you have entered appears to be invalid.');
                            disableContinue(2);

                            slideUpSection($('.businessSection'));
                            slideUpSection($('.icpSubmitSection'));
                            slideUpSection($('.missingICPSection'));

                            slideDownSection($(".stopFormBlock")); // included as the address has been corrected

                            $("#Form_SignUpForm_Cancellation_Reason").val("ICP Number entered was invalid");

                        }
                        $("span.icp-summary").html(icpNumber);
                        $("#Form_SignUpForm_ICP_Number").val(icpNumber[0]);


                        $("#Form_SignUpForm_SmartMeter").val($networkSmartMeter);
                        $("#Form_SignUpForm_MeterArray").val(JSON.stringify(data.meterDetailArray));
                        $("#Form_SignUpForm_ICPRegAddress").val('' + icpAddress);


                        if ($networkSmartMeter === true) {

                            //$dayNightOption.prop('checked', 'true').trigger("click");
                            $allDayOption.prop('checked', 'true');//.trigger("click");  FIREFOX MANGLE
                            // origDayNightText = $("label[for='Form_SignUpForm_PricePlan_DayNight']").html()
                            // origDayNightText = origDayNightText+ " <a href=\"/assets/Uploads/pricing-pdf/"+data.meterDetailArray[0][2]+".pdf\" target=\"_blank\">Click for Pricing PDF</a>"
                            // $("label[for='Form_SignUpForm_PricePlan_DayNight'] .labelStd").html(" <a href=\"/assets/Uploads/pricing-pdf/"+data.meterDetailArray[0][2]+".pdf\" target=\"_blank\">Click for Pricing PDF</a>");
                            $dayNightNote.hide();
                            $dayNightNote1.hide();
                            $allDayNote.hide();
                        }
                        else {
                            // temporary kludge to hide them all
                            $dayNightNote.hide();
                            $dayNightNote1.hide();
                            $allDayNote.hide();
                        }

                        //else {

                        $dayNightOption.change(function () {
                            if ($(this).is(":checked")) {
                                if ($networkSmartMeter === true) {
                                //    console.log('day night checked')
                                    $dayNightNote1.show();
                                    $dayNightNote.hide();
                                }
                                else {
                                //    console.log('day night checked no smart')
                                    $dayNightNote.show();
                                    $dayNightNote1.hide();
                                }

                            }

                        });
                        $allDayOption.change(function () {
                            if ($(this).is(":checked")) {
                            //    console.log('all day checked')
                                $dayNightNote.hide();
                                $dayNightNote1.hide();
                                $allDayNote.show()
                            }
                        });
                        // }
                    }
//                    console.log("networkProv: success");
                 //   console.log("Network is: " + data.result);
                })
                .fail(function () {
                //    console.log("networkProv: error");
                    $dayNightNote.hide();
                    $("span.network-result").html("not found");
                })
                .always(function () {
                    //                   console.log("networkProv: complete");
                });
    }


    /*
     *Get user threshold
     */
    function getMonthsThresholds(billValue, billMonth) {

        var $apiSelectedHidden = $("#Form_SignUpForm_UserTypeAPISelected");
      //  console.log($('#Form_SignUpForm_Suburb').data('api-url') + 'getMonthsThresholds');
        $.get($('#Form_SignUpForm_Suburb').data('api-url') + 'getMonthsThresholds', function (data) {

            var $bill = parseFloat(billValue),
                    $monthThreshhold = parseFloat(data.result[billMonth]);

            if ($bill <= $monthThreshhold) {
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
        optionset.children('li').each(function () {
            var $currentRadioWrapper = $(this);
            if ($currentRadioWrapper.find('input[type=radio]').is(":checked")) {
                $checkedRadio = $currentRadioWrapper;
            }
            $currentRadioWrapper.fadeOut('slow', function () {
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

        optionset.children('li').each(function () {
            if ($(this).find('a').hasClass('textLink')) {
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
        optionset.find("input[type=radio]").each(function () {
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

        if (isNaN(number))      number = 0;
        if (digits === 0)    digits = 1;

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
    function showSection(section, addSectionClass, addHover, dontShow) {
        //   console.log('showsection activated line 418');
        //   console.log(section);
        var addHoverBool = (addHover === undefined) ? true : addHover;
        var dontShowBool = (dontShow === undefined) ? false : dontShow;

        if (addSectionClass === "openSection") {

            section.addClass("openSection");

            if (!section.hasClass('hoverSection') && !dontShowBool) {
                TweenMax.fromTo(section, 1, {css: {alpha: 0, display: 'block'}}, {css: {alpha: 1, display: 'block'}});

                // scrollSectionIntoView(section);
                // TweenMax.to(section, 1, {rotationX:360, ease:Elastic.easeOut});
            }

            if (addHoverBool) {
                section.addClass("hoverSection");
            }
            resizeLi(section.find(".widthFixedLarge"));
        }

        if (addSectionClass === "completedSection") {
            section.addClass("completedSection");
            //console.log('hoversection');
            //console.log(section);
            section.addClass("hoverSection");
        }
    }


    function slideDownSection(section) {

        //  console.log('slidedownsection');
        //  console.log(section);
        TweenMax.fromTo(section, 2, {css: {alpha: 0}}, {css: {alpha: 1}});
        section.slideDown(1000, "easeInSine");
        section.find('.radioWrapper').height('auto');
        resizeLi(section.find(".widthFixedLarge"));
        // scrollSectionIntoView(section);

    }


    function slideUpSection(section) {
        // console.log('slideupsection');
        // console.log(section);
        TweenMax.fromTo(section, 1, {css: {alpha: 1}}, {css: {alpha: 0}});
        section.slideUp(1000, "easeOutSine");
        //resizeLi(section);
    }


    function scrollSectionIntoView(section) {
        if (section) {
            var topset = section.offset().top - 150;
            $("body,html").animate({
                scrollTop: topset
            }, 1000);
        }
    }


//    function moveInnerTabs() {
//        var $innerTab = $(".innerTabNav"),
//                $tab1 = $("li.tab-1"),
//                $tab2 = $("li.tab-2"),
//                $tab3 = $("li.tab-3");
//
//        $innerTab.append($tab2, $tab3);
//        $tab2.show();
//        $tab3.show();
//        $innerTab.fadeIn(1000);
//        $innerTab.find("li:first-child").addClass('ui-tabs-active');
//    }


    // Toggle fields based on radio value of a given optionset with two options
    // For application form
    function toggleAppFields(optionset, radioValue, field) {

        optionset.find("input[type=radio]").change(function (event) {
            var $this = $(this);
            if ($this.val() === radioValue) {
                field.show().css('display', 'table');
            }
            else {
                field.hide();
            }
        });
    }


    // Init
    $(function () {

        // Initially disable tabs
        $tabGroup.tabs("option", "disabled", [ 1, 2, 3, 4 ]);

        //moveInnerTabs();
        $questionFirst = $(".section:first");
        // $questionSecond = $(".section:first").next().next();

        showSection($questionFirst, "openSection", false);
        textQuestionAnswered($questionFirst);

        toggleAppFields($(".alternative-optionset"), "Yes", $("#field_Application_NameOfAlternativeContactToHaveAccessToTheAccount, #field_Application_DateOfBirthOfAlternativeContact,#field_Application_AlternativeContactPhoneNumber "));
        toggleAppFields($(".install-optionset"), "Different to Install Address", $(".postal-address"));
        toggleAppFields($(".move-in-optionset"), "Yes", $(".move-in-date"));
        toggleAppFields($(".dog-optionset"), "Yes", $(".dog-nature"));

        toggleAppFields($(".driverslicence-optionset"), "I do have a drivers licence", $(".dln5a, .dlv5b"));
        toggleAppFields($(".driverslicence-optionset"), "I do not have a drivers licence", $(".pnumvalue, .pnumtitle"));

        // FireFox Shim for arrow tables as in Submitted
        //http://stackoverflow.com/questions/5148041/does-firefox-support-position-relative-on-table-elements
        // FireFox is the *only* browser that doesn't support position:relative for
        // block elements with display set to "table-cell." Use javascript to add
        // an inner div to that block and set the width and height via script.
//        if ($.browser.mozilla) {  //deprecated as of 1.3 and removed in jquery 1.9. Im using migrate pluign
//            console.log($.browser.mozilla);
//            // wrap the insides of the "table cell"
//            $('#test').wrapInner('<div class="ffpad"></div>');
//
//            function ffpad() {
//                var $ffpad = $('.ffpad'),
//                        $parent = $('.ffpad').parent(),
//                        w, h;
//
//                // remove any height that we gave ffpad so the browser can adjust size naturally.
//                $ffpad.height(0);
//
//                // Only do stuff if the immediate parent has a display of "table-cell".  We do this to
//                // play nicely with responsive design.
//                if ($parent.css('display') == 'table-cell') {
//
//                    // include any padding, border, margin of the parent
//                    h = $parent.height();    //Was .outerHeight()
//
//                    // set the height of our ffpad div
//                    $ffpad.height(h);
//
//                }
//
//            }
//
//
//            // be nice to fluid / responsive designs
//            $(window).on('resize', function () {
//                ffpad();
//            });
//
//            // called only on first page load
//            ffpad();
//            console.log('ffpad');
//
//        }

        // prefill some form elements
        // $('#Form_SignUpForm_CustomerICPNumber_Yes').attr('checked', true); NO - it has to be a choice
        $('#Form_SignUpForm_Application_prev_acct_No').attr('checked', true);
        $('#Form_SignUpForm_Application_DriversLicenceChoice_Idohaveadriverslicence').attr('checked', true);
        $('#Form_SignUpForm_Application_postal_address_SameasInstallAddress').attr('checked', true);
        $('#Form_SignUpForm_Application_CreditCheckOK_Yes').attr('checked', true);
        $('#Form_SignUpForm_Application_AlternativeContact_No').attr('checked', true);
        //$('#Form_SignUpForm_SmoothPay_No').attr('checked', true);

//        $("#Form_SignUpForm_Application_dob").datepicker({
//            onClose: function () {
//                $('#Form_SignUpForm_Application_dob').valid();
//                console.log($("#Form_SignUpForm_Application_dob").val());
//            }
//            //showOn: "button",
//            //buttonImage: "images/calendar.gif",
//            // buttonImageOnly: true
//        });
//        $("#Form_SignUpForm_Application_DOB_Alternative").datepicker({
//            onClose: function () {
//                $('#Form_SignUpForm_Application_DOB_Alternative').valid();
//                console.log($("#Form_SignUpForm_Application_DOB_Alternative").val());
//            }
//        });

        $('#Form_SignUpForm_Application_dob').Zebra_DatePicker({
            view: 'years',
            format: 'd/m/Y',
            direction: -4000,
            show_icon: false,
            inside: false,
            offset:[-220,-5],
            //readonly_element: false,
            onSelect: function () {
                $('#Form_SignUpForm_Application_dob').valid();

            }
        });


        $('#Form_SignUpForm_Application_DOB_Alternative').Zebra_DatePicker({
            view: 'years',
            format: 'd/m/Y',
            direction: -4000,
            show_icon: false,
            inside: false,
            offset:[-220,-5],
            //readonly_element: false,
            onSelect: function () {
                $('#Form_SignUpForm_Application_DOB_Alternative').valid();
            }
        });

        $('#Form_SignUpForm_Application_move_in_date').Zebra_DatePicker({
            view: 'years',
            format: 'd/m/Y',
            show_icon: false,
            direction: ['01/01/2013',false],
            inside: false,
            offset:[-220,-5]
            //readonly_element: false,
        });

        $('#Form_SignUpForm_MonthBillReceived').Zebra_DatePicker({
            view: 'months',
            format: 'F',
            header_captions: {'months': ''},
            header_navigation: ['', ''],
            show_icon: false,
            inside: false,
            offset:[-220,-5],
            //readonly_element: false,
            onSelect: function(view, elements) {
                $('input.billMonth').trigger('change')
            }
        });


        $("#ui-datepicker-div").wrap('<span class="scopeWrapper" />'); // fix up scoping of date widget

    });


    /* Find optionsets and check if they have been answered
     * Hides options that havent been selected
     * Change function will show optionset fields again
     * Extra checks for special cases too
     */
    $("#Sign_up .section").not('.section.application').each(function () {

        //the current section
        var $section = $(this),
                $nextSection = $section.next(),
                $stopFormBlock = $(".stopFormBlock");


        $section.find('ul.qOptions').not("#Form_SignUpForm_SchoolLevel").each(function () {

            // The current optionset
            var $optionset = $(this);

            // Generic function to show next section after a radio button is clicked
            $optionset.find("input[type=radio], input[type=checkbox]").change(function () {
//                console.log('optionset');
//                console.log($optionset);
                if ($(this).is("input[type=radio]")) {
                    hideRadioButtons($optionset);
                }
//                console.log('showsection generic 735');
//                console.log($section);
                showSection($section, "completedSection");

                if ($nextSection.hasClass('section')) {
                    if ($optionset.is(':not(#Form_SignUpForm_CustomerICPNumber)')) {

//                        console.log('showsection nextsection generic 746');
//                        console.log($optionset);
//                        console.log($nextSection);
                        showSection($nextSection, "openSection");
                    }
                }

                if ($nextSection.hasClass('ctaSection')) {
                    enableContinue(2);
                }
            });


            // Bind the ability to show all options again in optionset
            $optionset.find('li a.textLink').click(function (e) {
                e.preventDefault();
                showRadioButtons($optionset);
            });


            // Checks for promo code
            if ($optionset.is('#Form_SignUpForm_PulsePromotionCode')) {
                var $codeEntryBlock = $section.find(".innerSection"),
                        $codeSuccessMessage = $codeEntryBlock.find(".codeSuccess"),
                        $promoInput = $codeEntryBlock.find("input[type=text]"),
                        $promoSubmit = $codeEntryBlock.find(".promoSubmit");

                $optionset.find("input[type=radio]").change(function (event) {

                    hideRadioButtons($optionset);

                    if ($(this).val() == "Yes") {
                        $section.removeClass('completedSection').addClass('multiSection');
//                        console.log('slidedownsection promosubmit 747');
//                        console.log($codeEntryBlock);
                        slideDownSection($codeEntryBlock);
                        // $nextSection.removeClass("openSection").removeClass('hoverSection');
                        // $nextSection.attr("style", "");
                    }
                    else {
//                        console.log('slideupsection showsection showsection promosubmit 747');
//                        console.log($codeEntryBlock);
//                        console.log($section);
//                        console.log($nextSection);
                        slideUpSection($codeEntryBlock);
                        showSection($section, "completedSection");
                        showSection($nextSection, "openSection");
                        $promoSubmit.fadeIn(700);
                        $codeSuccessMessage.fadeOut(1000);
                        $promoInput.val("");
                    }
                });

                $promoSubmit.click(function (e) {
                    e.preventDefault();
                    if ($promoInput.val() !== "") {
                        $codeSuccessMessage.slideDown(1000, function () {
                            $promoSubmit.fadeOut(700);
//                            console.log('showsection promosubmit 766');
//                            console.log($section);
//                            console.log($nextSection);
                            showSection($section, "completedSection");
                            showSection($nextSection, "openSection");
                        });
                    }
                });
            }

            // Checks for ICP number and controls progress to next tab
            if ($optionset.is('#Form_SignUpForm_CustomerICPNumber')) {

                $optionset.find("input[type=radio]").change(function (event) {
                    hideRadioButtons($optionset);

//                    console.log('showsection just after hide icp radio buttons 779');
//                    console.log($section);
                    //showSection($section, "completedSection");  never need this, already done about 719???

                    if ($(this).val() === "No") {
                        // Stop the form
                        disableContinue(1);
                        //slideDownSection($('.icpSubmitSection'));
//                        console.log('form func 785 slidedownsection');
//                        console.log($stopFormBlock);

                        slideDownSection($stopFormBlock);

//                        console.log('form func 785  slideupsection');
//                        console.log($('.icpSubmitSection'));

                        slideUpSection($('.icpSubmitSection'));
                        $("#Form_SignUpForm_Cancellation_Reason").val("ICP isn't correct");
                    }
                    else if ($(this).val() === "Enter") {
                        // Stop the form
                        disableContinue(1);
                        //slideDownSection($stopFormBlock);

//                        console.log('form func 808 slidedownsection');
//                        console.log($('.icpSubmitSection'));

                        slideDownSection($('.icpSubmitSection'));
                        scrollSectionIntoView($('.icpSubmitSection'));

                        if ($('.businessSection').is(":visible")) {
                            slideUpSection($('.businessSection'));
                        }

                        if ($stopFormBlock.is(":visible")) {
                            slideUpSection($stopFormBlock);
                        }
                        //$("#Form_SignUpForm_Cancellation_Reason").val("ICP isn't correct");
                    }
                    else {
                        // carry on
                        enableContinue(1);

//                        console.log('form func 814 slideupsection');
//                        console.log($('.icpSubmitSection'));

                        var delay = 1000;//1 seconds
                        //setTimeout(function () {
//                            console.log('answer yes so slide up business and icpsubmit');
                        slideUpSection($('.businessSection'));
                        slideUpSection($('.icpSubmitSection'));
                        //your code to be executed after 1 seconds
                        //}, delay);


                        if ($stopFormBlock.is(":visible")) {
                            slideUpSection($stopFormBlock);
                        }
                    }
                });
            }

            // Extra checks for school search optionset
            if ($optionset.is('#Form_SignUpForm_PulseSchool')) {

                //Block that holds the search input
                var $schoolSearchBlock = $section.find(".innerSection"),
                        $schoolNotFound = $schoolSearchBlock.next().find(".notFound"),
                        $schoolNotFoundMessage = $schoolSearchBlock.next().find(".submitMessage");


                $optionset.find("input[type=radio]").change(function (event) {
                    if ($(this).val() == "Yes") {
                        $section.removeClass('completedSection').addClass('multiSection');
                        if (!$nextSection.hasClass('completedSection')) {
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
                $schoolSearchBlock.find('a.textLink').click(function (e) {
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
                $schoolNotFound.find('a.btn').click(function (e) {
                    e.preventDefault();
                    var $schoolName = $schoolNotFound.find("#Form_SignUpForm_SchoolName"),
                            $schoolRadios = $schoolNotFound.find('.radio');

                    $section.removeClass('completedSection');

                    // Add a rule for validation of the manual school name input
                    $schoolName.rules("add", {
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
                    if ($schoolName.valid() && $schoolRadios.valid()) {
                        //$schoolSearchBlock.find('a.textLink').unbind('click');
                        slideUpSection($schoolNotFound);
                        slideDownSection($schoolNotFoundMessage);
                        showSection($section, "completedSection");
                        showSection($nextSection, "openSection");
                    }
                });

                schoolWidget.on("result:select", function (value, data) {
                    $('#Form_SignUpForm_School').trigger('change')
                });



                // Force selection from the list of schools, otherwise clear the input
                $("#Form_SignUpForm_School").on("change",function (event, ui) {
                    if (!ui.item) {
                        $("#Form_SignUpForm_School").val("");
                    }
                    else {
//                        console.log('slideupsection, showsection, showsection school');
                        slideUpSection($schoolNotFound);
                        showSection($section, "completedSection");
                        showSection($nextSection, "openSection");
                    }
                }).on("autocompletefocus", function (event, ui) {
                    return false;
                });
            }


            // Controls the flow of final question
            if ($optionset.is('#Form_SignUpForm_SmoothPay')) {

                var $smoothpayFreq = $section.find('.innerSection'),
                        $smoothpayFreqOptionset = $smoothpayFreq.find('ul.qOptions');

                $optionset.find("input[type=radio]").change(function () {

                    $smoothOp = $(this);
                    if ($smoothOp.val() == "No") {
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

            if ($optionset.is('#Form_SignUpForm_SmoothPayFrequency')) {
                $optionset.find("input[type=radio]").change(function () {
                    enableContinue(3);
                });
            }
        });


        /* Electricity Usage Question (Tab 2)
         * Special case for question with two inputs (a text input and select input)
         */
        if ($section.hasClass('textFieldsOnly')) {
            //console.log('textfield');
            //console.log($section);
            var $billValue = $section.find("input.billAmount"),   //f
                    $billMonth = $section.find("input.billMonth"),
                    $billValueNumber = 0;

            // Add currency formatting
            $billValue.blur(function (event) {
                if ($billValue.val() !== "") {
                    $billValue.val('$' + formatNumber($billValue.val(), 0, 2));
                }
            });
            // The allows progression only if both inputs have user added values
            $section.find("select, input").change(function () {   //change now triggered by zebra  809
                $billValueNumber = $billValue.val().replace('$', '');
                console.log("Bill Value Number: " + $billValueNumber);
                console.log("A: " + $billValue.val() + " B: " + $billMonth.val());
                if ($billValueNumber > 0 && $billMonth.val() !== '') {      //} "placeholder") {
                    console.log('line 795 pricing');
                    console.log($billMonth.val());
                    showSection($section, "completedSection");
                    showSection($nextSection, "openSection");
                    $nextSection.next().fadeIn('slow');
                    enableContinue(2);

                    getMonthsThresholds($billValueNumber, $billMonth.val());
                    /// now use get months thresholds to parse the data returned by

                    // showSection($nextSection.next(), "openSection");

                }
            });
        }

        $section.find("#Form_SignUpForm_Suburb").each(function () {

            $addressInput = $(this);

            widget.on("result:select", function (value, data) {
                $addressInput.val(value);

                getICPNumber($addressInput, $section, data);
                $addressInput.trigger("change");
                $("#Form_SignUpForm_street_number").val(data.number || '');
                $("#Form_SignUpForm_street_alpha").val(data.alpha || '');
                $("#Form_SignUpForm_unit_identifier").val(data.unit_identifier || '');
                $("#Form_SignUpForm_street").val(data.street || '');
                $("#Form_SignUpForm_street_type").val(data.street_type || '');
                $("#Form_SignUpForm_suburb").val(data.suburb || '');
                $("#Form_SignUpForm_postal_suburb").val(data.postal_suburb || '');
                $("#Form_SignUpForm_city").val(data.city || '');
                $("#Form_SignUpForm_region").val(data.region || '');
                $("#Form_AddressSearchForm_postcode").val(data.postcode || '');

            });

            widget.on("results:empty", function (value, data) {
                console.log('no address');
                $("#Form_SignUpForm_Cancellation_Reason").val("No Addressfinder address found");
                slideDownSection($('.stopFormBlock'));
            });

//            $addressInput.blur(function(value,data){
//                $(this).delay(1000).queue(function(data){
//                    console.log("blur delay");
//                    getICPNumber($addressInput,$section, data);
//                    $(this).dequeue()
//                });
//                console.log(isRequesting);
//            });
        });


        /* Keeps the white highlight on the section when focus is on a text input
         * Highlight removed when focuses out  (goes back to only on hover)
         */
        $section.find("input[type=text]").each(function () {
            $thisInput = $(this);
            $thisInput.focus(function (event) {
                $section.removeClass("hoverSection");
            }).focusout(function (event) {
                $section.addClass("hoverSection");
            });
        });
    });


    $(".icpSubmit").click(function (e) {
        e.preventDefault();
        if ($("#Form_SignUpForm_ICP_Number").val() !== "") {
            $icpNum = $("#Form_SignUpForm_ICP_Number").val();
            console.log($icpNum);
            $icp = new Array($icpNum);
            getNetworkProvider($icp);
            slideUpSection($('.icpSubmitSection'));
            slideUpSection($('.businessSection, .missingICPSection'));

            // slideDownSection($('.icpDisplaySection'));
            showRadioButtons($('#Form_SignUpForm_CustomerICPNumber'));
            $('#Form_SignUpForm_CustomerICPNumber_Yes').attr('checked', true);
            enableContinue(1);
        }
    });


    $(".stopFormSubmit").click(function (e) {
        //e.preventDefault();

        var $stopFormBlock = $(".stopFormBlock"),
                $custPhone = $stopFormBlock.find("input[type=text]"),
                $timeToCall = $("#Form_SignUpForm_BestTimeToContact"),
                $form = $(this).closest('form');

        console.log($timeToCall.val());

        $custPhone.rules("add", {
            required: true,
            minlength: 6,
            phone:true,
            messages: {
                required: "A phone number is required",
                phone: "Please enter a valid phone number",
                minlength: jQuery.validator.format("Oops! At least {0} characters are necessary")
            }
        });

        // add the rule here
        $.validator.addMethod("valueNotEquals", function (value, element, arg) {
            return arg != value;
        }, "Value must not equal arg.");

        // configure your validation
        console.log($custPhone.valid());
        if($custPhone.valid()){
            //$form.validate().form();
            $form.unbind('submit'); //unbind form handlers so the validator does not try to validate the rest of form on last page
            return true;
            //document.getElementById("Form_SignUpForm").action="/home/SignUpForm";
            //document.getElementById("Form_SignUpForm").submit(); // necessary to get round validation on last page
        }
        else{
       // if ($custPhone.val() === "" || $timeToCall.val() === "") {
            return false;
        }

    });

    $(".resetBtn").click(function (e) {
        e.preventDefault();
        location.reload();
    });

    $(".btnCancel").click(function (e) {
        e.preventDefault();
        $("#Form_SignUpForm_Cancellation_Reason").val("Decided to Cancel Application Form");
        $(".nameWrapper.cancellation").html("Can we speak to you to find out why you cancelled?");
        $(".nameWrapper.cancellation").next().html("Our friendly Customer Service team can answer any questions or concerns you may have.");
        slideDownSection($(".stopFormBlock"));
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
        $tabGroup.tabs("enable", tab);
        $(".nextTab").removeClass('disabled');

    }

    // Enable the back button and given tab
    function enableBack(tab) {
        $tabGroup.tabs("enable", tab);
        $(".backTab").removeClass('disabled');
    }


    // Disable the continue button and given tab
    function disableContinue(tab) {
        $tabGroup.tabs("disable", tab);
        $(".nextTab").addClass('disabled');
        console.log("disabled");
    }


    // Allows the passed in custom ddl/select to be reset programatically
    // This includes both the custom ddl view, and the underlying hidden select
    function resetSelect(ddl) {
        ddl.find("option").each(function () {
            if ($(this).val() === "placeholder") {
                $(this).prop("selected", true);
                $(this).parent().parent().find(".ddl").html($(this).html() + ' <span class="ddl-arrow"></span>');
            }
            else {
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


    $(".buildPlanInner").click(function (event) {
        $tabGroup.tabs("option", "active", 0);
    });


    // Add functionaility to the continue button
    $(".nextTab").click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('disabled')) {
            var $active = $("#Sign_up").tabs("option", "active");

            // Check if we navigating to the final application form tab
            if ($active === 3) {
                $tabGroup.tabs("enable", 4);
                $(".section.application").fadeIn("slow");
                $(this).removeClass('disabled');
            }

            $tabGroup.tabs("option", "active", $active + 1);
            enableBack();

            //Continue button always enabled on summary tab
            if ($active === 2) {
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

    // Add functionaility to the back button
    $(".backTab").click(function (e) {
        e.preventDefault();
        if (!$(this).hasClass('disabled')) {
            var $active = $("#Sign_up").tabs("option", "active");
            enableBack();
            // Check if we navigating to the final application form tab
            if ($active === 3) {
                $tabGroup.tabs("enable", 4);
                $(".section.application").fadeIn("slow");
                $(this).removeClass('disabled');
            }

            $tabGroup.tabs("option", "active", $active - 1);
            enableContinue();

            //Back button always disabled on tab 1b
            if ($active === 1) {
                $(this).addClass('disabled');
            }
            else {
                $(this).removeClass('disabled');
            }


        }
    });

    // Reset and resize li's to match in row when tab is activated
    // Two functions may also need to be called when transitioning from one question to another
    $tabGroup.on("tabsactivate", function (event, ui) {
        var $firstSectionInTab = ui.newPanel.find('.openSection');
        $tabNav = $(".tabNav"),
                $innerTabNav = $(".innerTabNav");
       // console.log('showsection tabsactivate 1318');
       // console.log($firstSectionInTab);
        showSection($firstSectionInTab, "openSection", false);
        var $active = $("#Sign_up").tabs("option", "active");
        if ($active === 4) {
            $(".Actions").show();
            $(".controls").hide();
        }
        else {
            $(".Actions").hide();
            $(".controls").show();
        }

        if ($active === 3) {
            $(".nextTab").removeClass('disabled');
        }

        //Add active styling to first tab when inner tabs are active
        if ($active < 3) {
            $tabNav.find("li:first-child").addClass("ui-tabs-active");
        }
        else {
            $tabNav.find("li:first-child").removeClass("ui-tabs-active");
        }

//        if ($active === 0) {
//            $innerTabNav.find("li:first-child").addClass('ui-tabs-active');
//        }
//        else {
//            $innerTabNav.find("li:first-child").removeClass('ui-tabs-active');
//        }

        // Only show inner tabs navigation in the "Build Your Plan" section
//        if ($active > 2)
//            $innerTabNav.hide();
//        else
//            $innerTabNav.show();

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


String.prototype.toTitleCase = function () {
    var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function (match, index, title) {
        if (index > 0 && index + match.length !== title.length &&
                match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
                (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
                title.charAt(index - 1).search(/[^\s-]/) < 0) {
            return match.toLowerCase();
        }

        if (match.substr(1).search(/[A-Z]|\../) > -1) {
            return match;
        }

        return match.charAt(0).toUpperCase() + match.substr(1);
    });
};


/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */


function logf(msg) {
    if (typeof window.console != 'undefined' && typeof window.console.log == 'function') {
        console.log(msg);
    }
}

// Firefox table shim according to http://stackoverflow.com/questions/5148041/does-firefox-support-position-relative-on-table-elements
// And

$(function () {


});


