$(function () {
    $('#Form_SignUpForm button').click(function (e) {
        e.preventDefault();
    });

    $.validator.addMethod('dob', function (value, element, param) {
        var check = false;

        var Now18 = Date.today().add({years: -18});
        var Entered = Date.parse(value);

        //console.log(Now18.toString() + Entered.toString());
        //console.log(Date.compare(Now18, Entered));
        if (Entered !== null && !isNaN(Entered)) {
            check = (Date.compare(Now18, Entered) >= 0) ? true : false;
        }
        console.log(this.optional(element))
        console.log(check);
        return this.optional(element) || check;
    }, 'Please enter a valid date of birth');


    $.validator.addMethod("phoneUS", function (phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 9 &&
                phone_number.match(/^\+[0-9]{11}$/);
    }, "Please specify a valid phone number");

    $.validator.addMethod("phone", function (phone_number, element) {
        phone_number = phone_number.replace(/\s+/g, "");
        return this.optional(element) || phone_number.length > 6 &&
                phone_number.match(/^[0-9+\(\)#\.\s\/ext-]+$/);  //http://stackoverflow.com/questions/123559/a-comprehensive-regex-for-phone-number-validation
        //phone_number.match(/^(((\+?64\s*[-\.]?[3-9]|\(?0[3-9]\)?)\s*[-\.]?\d{3}\s*[-\.]?\d{4})|((\+?64\s*[-\.\(]?2\d{1}[-\.\)]?|\(?02\d{1}\)?)\s*[-\.]?\d{3}\s*[-\.]?\d{3,5})|((\+?64\s*[-\.]?[-\.\(]?800[-\.\)]?|[-\.\(]?0800[-\.\)]?)\s*[-\.]?\d{3}\s*[-\.]?(\d{2}|\d{5})))$/);
    }, "Invalid phone number");

    // dateUK function, modified from dateITA in additional-methods.js
    // makes sure dates are valid (& US-format: m/d/yyyy)
    jQuery.validator.addMethod(
            "dateNZorig",
            function (value, element) {
                var check = false;
                var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                if (re.test(value)) {
                    var adata = value.split('/');
                    var dd = parseInt(adata[0], 10); // was gg (giorno / day)
                    var mm = parseInt(adata[1], 10); // was mm (mese / month)
                    var yyyy = parseInt(adata[2], 10); // was aaaa (anno / year)
                    var xdata = new Date(yyyy, mm - 1, dd);
                    if (( xdata.getFullYear() == yyyy ) && ( xdata.getMonth() == mm - 1 ) && ( xdata.getDate() == dd ))
                        check = true;
                    else
                        check = false;
                } else
                    check = false;
                return this.optional(element) || check;
            },
            "Please enter a valid date as dd/mm/yyyy"
    );


    jQuery.validator.addMethod(
            "dateNZ",
            function (value, element) {
                var check = false;
                var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                if (re.test(value)) {
                    var datetest = Date.parse(value);
                    // alert(value + datetest.toString())
                    check = (datetest === null) ? false : true;
                    return this.optional(element) || check;
                }
            },
            "Please enter a valid date as dd/mm/yyyy"
    );
    jQuery.validator.addMethod(
            "date",
            function (value, element) {
                var check = false;
                var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                if (re.test(value)) {
                    var datetest = Date.parse(value);
                    // alert(value + datetest.toString())
                    check = (datetest === null) ? false : true;
                    return this.optional(element) || check;
                }
            },
            "Please enter a valid date as dd/mm/yyyy"
    );
    jQuery.validator.addMethod(
            "date-alt",
            function (value, element) {
                var check = false;
                var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
                if (re.test(value)) {
                    var datetest = Date.parse(value);
                    // alert(value + datetest.toString())
                    check = (datetest === null) ? false : true;
                    return this.optional(element) || check;
                }
            },
            "Please enter a valid date as dd/mm/yyyy"
    );


    // attach Validate plugin to form
    $("#Form_SignUpForm").validate();

    $('#Form_SignUpForm_Application_dob').rules("add", {
        dob: true,
        messages: {
            dob: "Over 18 years old is a requirement"
//            //minlength: jQuery.format("Oops! At least {0} characters are necessary")
        }
    });

    $('#Form_SignUpForm_Application_YourPhoneNumber').rules("add", {
        phone: true,
        messages: {
            phone: "Please enter a valid phone number"

        }
    });


//    $('#Form_SignUpForm_Application_CreditCheckOK_Yes').rules("add", {
    $("input[name*='Application_CreditCheck']").rules("add", {
        required: true,
        equalTo: "#Form_SignUpForm_Application_CreditCheckOK_Yes",
        messages: {equalTo: " You must select Yes to proceed with this application"}
    });

    $("input[name*='Application_IAcceptTheTermsAndConditions']").rules("add", {
        required: true,
        equalTo: "#Form_SignUpForm_Application_IAcceptTheTermsAndConditions_Yes",
        messages: {equalTo: " You must select Yes to proceed with this application"}
    });


});

