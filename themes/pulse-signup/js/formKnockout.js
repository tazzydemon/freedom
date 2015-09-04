// ----------------------------------------------------------------------------
// Reusable bindings - ideally kept in a separate file

ko.bindingHandlers.customVisible = {
    init: function (element, valueAccessor) {
        // Start visible/invisible according to initial value
        var shouldDisplay = valueAccessor();
        $(element).toggle(shouldDisplay);
    },
    update: function (element, valueAccessor) {
        // On update, fade in/out
        var shouldDisplay = valueAccessor();
        shouldDisplay ? $(element).slideDown('slow') : $(element).slideUp('slow');
    }
};


/*
 *  Gets the data-benefit attribute for a single element
 */
ko.bindingHandlers.getBenefit = {
    init: function (element, valueAccessor) {
        valueAccessor()(element.getAttribute('data-benefit'));
    },

    update: function (element, valueAccessor) {
        var value = valueAccessor();
        element.setAttribute('data-benefit', ko.utils.unwrapObservable(value));
    }
};


/*
 *  Gets the data-benefit attribute for the selected radio button elements
 */
ko.bindingHandlers.getCheckedBenefit = {
    update: function (element, valueAccessor) {
        if (element.checked === true) {
            valueAccessor()(element.getAttribute('data-benefit'));
        }
    }
};

ko.bindingHandlers.slideVisible = {
    update: function(element, valueAccessor, allBindings) {
        // First get the latest data that we're bound to
        var value = valueAccessor();

        // Next, whether or not the supplied model property is observable, get its current value
        var valueUnwrapped = ko.unwrap(value);

        // Grab some more data from another binding property
        var duration = allBindings.get('slideDuration') || 400; // 400ms is default duration unless otherwise specified

        // Now manipulate the DOM element
        if (valueUnwrapped == true)
            $(element).slideDown(duration); // Make the element visible
        else
            $(element).slideUp(duration);   // Make the element invisible
    }
};


// ----------------------------------------------------------------------------
// END Reusable bindings


function SignupFormViewModel() {

    var self = this;

    /*
     * INTRO - NAME
     */
   self.userName = ko.observable();
   self.editingName = ko.observable(true);

    self.fullGreeting = ko.computed(function () {
        if (self.userName()) {
            return " " + self.userName()+" <span style='font-size:0.6em'> (Click to change)</span>";
        }
    });

    this.editName = function () {
        this.editingName(true);
        this.userName("");
        return true;
    };

     /*
     * INTRO - New Early Contact Number
     */
   self.userContactNumber = ko.observable();
   self.editingContactNumber = ko.observable(true);

    self.fullContactNumber = ko.computed(function () {
        if (self.userContactNumber()) {
            return " " + self.userContactNumber() + " <span style='font-size:0.6em'> (Click to change)</span>";;
        }
    });

    this.editContactNumber = function () {
        this.editingContactNumber(true);
        this.userContactNumber("");
        return true;
    };

     /*
     * Q1 - Promotion Code
     * Observing user entered suburb, which is then displayed in the summary table
     */


    this.promotionCode = ko.observable();
    this.promotionCodeValue = ko.observable();
    this.promotionCodeSummary = ko.computed(function () {
        if (this.promotionCode() == "Yes") {
          //  console.log('promo ' + this.promotionCodeValue());
            return "Yes. Your promotion code is " + this.promotionCodeValue();
        }

        else if (this.promotionCodeValue() == 'TGNZES1508') {
         //   console.log('promo ' + this.promotionCodeValue());
            $('#application_summary_line1 a').css('opacity',0.3).attr('dialog_id', '');

            return "Yes. You have received the Survey Credits";
        }

        else {
         //   console.log('no promo ');
         //   console.log('promo '+this.promotionCodeValue());
            return "No Promotion Code entered";
        }
    }, this);


    /*
     * Q2 - Suburb
     * Observing user entered suburb, which is then displayed in the summary table
     */
    self.userSuburb = ko.observable();
    // self.summarySuburb = ko.computed(function() {
    //     if(self.userSuburb()){
    //         return "Living in " + self.userSuburb();
    //     }
    // });


    /*
     * Q2 - Electricity Usage
     * //TO DO: NEED MODEL FOR CALCULATION
     */

    self.network = ko.observable();


        /*
     * Q2a - Gas Selection
     * //TO DO: NEED MODEL FOR CALCULATION
     */

    self.chooseGasChoice = ko.observable();


    /*
     * Q3 - Price Plans
     */

//    this.promotionCode = ko.observable();
    this.primaryResidenceDeclaration = ko.observable();
    this.userTypeSummary = ko.computed(function () {
        if (this.primaryResidenceDeclaration() == "Yes") {
            if($("#Form_SignUpForm_UserTypeAPISelected").val == "Low User"){
                return "Low User - must be a Primary Residence";
                }else{
                return "Standard User based on consumption, ";
            }
        }else {
            return "Standard User (Not a Primary Residence)";
        }

    }, this);



    // Observe user selected price plan
    self.pricePlan = ko.observable('All Day Price');
    self.servicesChecked = ko.observableArray();


    /*
     * Q5 - Electronic Services.
     */


    /*
     * Q6 - SmoothPay
     */
    self.smoothPay = ko.observable();
    self.smoothPayFrequency = ko.observable();
    this.summarySmoothPay = ko.computed(function () {
        if (this.smoothPay() == "Yes") {
            $('#application_summary_line11 a').css('opacity', 1).attr('dialog_id', 'Form_SignUpForm_SmoothPayFrequency');
            return "You have chosen to pay by SmoothPay. You will receive a direct debit form in your Welcome Pack.";
        }

        else {
            $('#application_summary_line11 a').css('opacity', 0.3).attr('dialog_id', ''); //get rid of smoothpay freqency lines
            return "You have chosen not to use SmoothPay";
        }
    }, this);


    this.smoothPayFrequencySummary = ko.computed(function () {
        if (self.smoothPay() == "Yes") {
            return self.smoothPayFrequency();
        }

        else {
            // $('#application_summary_line11 a').css('opacity',0.3); //get rid of smoothpay frequency button

            return "SmoothPay has not been selected.";
        }
    }, this);


    /*
     * Q6 - Payment Options - Budget Buddy
     * Value = Benefit?
     */

    this.budgetBuddyOption = ko.observable();

    this.benefitBudgetBuddy = ko.computed(function () {
        if (this.budgetBuddyOption()) {
            if (this.budgetBuddyOption() == "0") {
                return "Don't Smooth Payments";
            }
            else {
                return "Pay $" + this.budgetBuddyOption();
            }
        }
    }, this);


    /*
     * Q7 - Price Plans
     */

    this.paymentOption = ko.observable();
    this.benefitPaymentOption = ko.observable();

    this.summaryPaymentOption = ko.computed(function () {
        if (this.paymentOption() == "Decide Later") {
            return this.paymentOption();
        }
        else {
            if (this.paymentOption()) {
                return "Pay by " + this.paymentOption();
            }
        }
    }, this);


    /*
     * Q8 - Choose a school
     */

    //this.chooseSchool = ko.observable();
    //this.chooseSchoolSearch = ko.observable();
    //
    //this.summaryChooseSchool = ko.computed(function () {
    //    if (this.chooseSchool() == "Yes") {
    //        if (this.chooseSchoolSearch()) {
    //            return "Pulse will donate $50 to " + this.chooseSchoolSearch() + " each year that you are a customer";
    //        }
    //    }
    //    else if (this.chooseSchool() == "No Thanks") {
    //        return "No Thanks selected";
    //    }
    //    else if (this.chooseSchool() == "Choose For Me") {
    //        return "We will choose a school on your behalf";
    //    }
    //    else {
    //        return "Pulse will donate $50 to local school on your behalf each year that you are a customer";
    //    }
    //}, this);


    this.summaryOnlineDiscount = ko.computed(function () {
        if (this.servicesChecked().indexOf('OnlineBill') != -1) {
            return "By choosing to receive your bills online you will receive a discount each month";
        }
        else {
            return "You have chosen not to receive your bills online each month";
        }
    }, this);


    this.summaryDirectDebitDiscount = ko.computed(function () {
        if (this.servicesChecked().indexOf('DirectDebit') != -1) {
            return "By choosing to pay by Direct Debit you will receive a discount each month";
        }
        else {
            return "You have chosen not to pay by Direct Debit";
        }
    }, this);

    this.updateCheckboxesArray = function (data, event) {
        $val = event.currentTarget.value;
        if ($val == 'No') {
            this.servicesChecked.removeAll();
            $('#Form_SignUpForm_ElectronicServices_No').attr('checked', true);
              }
        if($val == 'DirectDebit' || $val== 'OnlineBill' ){
            $('#Form_SignUpForm_ElectronicServices_No').attr('checked', false);
        }
        // Click handler needs to return true for the Checked binding click hander to function

        return true;
    }

    // Show the school search inner section
    //self.showSchoolSearch = ko.computed(function () {
    //    if (self.chooseSchool() == "Yes") {
    //        return "openInnerSection";
    //    }
    //});

    // Show section where users can manually enter school details
    //self.showSchoolNotFound = ko.observable(false);
    //self.toggleSchoolNotFound = function () {
    //    self.showSchoolNotFound(true);
    //};
}

var my = { viewModel: new SignupFormViewModel() };
//bodge for IE8 see

//http://www.mkyong.com/javascript/focus-is-not-working-in-ie-solution/
//http://stackoverflow.com/questions/3452281/greybox-cant-move-focus-to-the-control-because-it-is-invisible-not-enabled-o
//http://answers.microsoft.com/en-us/ie/forum/ie8-windows_other/cant-move-focus-to-the-control-because-it-is/bd755e8b-5eec-45ed-bfad-711cb350e5a4

setTimeout(function() {
    ko.applyBindings(my.viewModel);
}, 10);










