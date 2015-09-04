<?php

class LpgPricing extends UserDefinedForm {

    //private static $signupemail = null;
    //private static $failemail = null;


    public function getCMSFields() {
        $fields = parent::getCMSFields();
        $editor = new HtmlEditorField("OnCompleteMessage", "Confirmation Message", $this->OnCompleteMessage);

        $fields->addFieldToTab("Root.Main", $editor, 'Content');


        //   $fields->removeFieldFromTab('Root.Main', 'Content');
        //   $fields->removeFieldfromTab('Root', 'FormOptions');
        //   $fields->removeFieldfromTab('Root', 'Submissions');

        return $fields;
    }
    //$MainContent= SiteTree::get()->filter(array('ID' => $this->ID));
//    public function MainContent(){
//
//          $mainContent = SiteTree::get()->byID($this->ID);
//        //var_dump($mainContent);
//           return $mainContent->Content;
//    }

}

class LpgPricing_Controller extends Page_Controller {
    private static $allowed_actions = array(
            'SignUpForm', 'doSignUp', 'doPhoneSubmit', 'Submitted', 'getICPNumber', 'getSchool', 'submit', 'getNetworkProvider', 'getMonthsThresholds'
    );

    public function init() {
        parent::init();
        $routing = $this->getURLParams();//$this->getAction();
        if (empty($routing['Action'])) {
            if (Director::isLive()) {
                ChromePhp::log('live signup');
                Requirements::combine_files(
                        'pulse-signup-form.js',
                        array(
                            //                <!-- form validation -->
                                $this->ThemeDir() . '/js/thirdparty/jquery.validate.js',
                                $this->ThemeDir() . '/js/thirdparty/additional-methods.min.js',
                                $this->ThemeDir() . '/js/thirdparty/datejs/date-en-NZ.js',
                                $this->ThemeDir() . '/js/form-validation.js',
                        )
                );
            }
            else {
                ChromePhp::log('not live signup');
                                //                <!-- form validation -->
                Requirements::javascript($this->ThemeDir() . '/js/thirdparty/jquery.validate.js');
                Requirements::javascript($this->ThemeDir() . '/js/thirdparty/additional-methods.min.js');
                Requirements::javascript($this->ThemeDir() . '/js/thirdparty/datejs/date-en-NZ.js');
                Requirements::javascript($this->ThemeDir() . '/js/form-validation.js');


            }
        }



        //Requirements::javascript('userforms/thirdparty/jquery-validate/jquery.validate.js');
        //Requirements::javascript('userforms/javascript/UserForm_frontend.js');
        //if ($this->HideFieldLabels) Requirements::javascript('userforms/thirdparty/Placeholders.js/Placeholders.min.js');
        //Requirements::block(FRAMEWORK_DIR . '/javascript/Datefield.js');
    }


    /*
    * Sign Up form
    */
    public function SignUpForm() {
        require_once('FirePHPCore/fb.php');
        $request = $this->getRequest();
        $promo = (string) $request['credits'];
        $validator = RequiredFields::create();

        if($this->Content != ''){
            $firstTabRightTitle = '<p>Thank you for checking out our Freedom Plans!</p><p>If you choose not to join Pulse Energy, we will not keep your details on record.</p>';
        }else{
            $firstTabRightTitle = SignUpTab1::_tPlain('Hi , Text', 'Thank you for choosing Pulse Energy! We look forward to having you as a customer.<br/> Building your Freedom Plan will take a few minutes');
        }
        $fields = FieldList::create(
                OurTabSet::create(
                        $name = 'Sign_up',
                        $Title = $this->Title,
                        Tab::create(
                                $title = 'Build Your Plan',
                                FieldGroup::create(
                                        TextField::create('CustomerName', 'Hi')
                                                ->setRightTitle($firstTabRightTitle)
                                                ->setAttribute('placeholder', 'eg. John ')
                                                ->setAttribute('data-bind', "value: userName, visible: editingName && !userName(), hasFocus: editingName")
                                                ->setSmallFieldHolderTemplate("CustomerName_holder_small")
                                )->addExtraClass('openSection'),
                                FieldGroup::create(
                                        AdvOptionsetField::Create('PulsePromotionCode', SignUpTab1::_tPlain('Address,ICP Screen - Q1 title', 'Do you have a Pulse promotion code'), array(
                                                'Yes' => 'Yes',
                                                'No' => 'No'
                                        ))
                                                ->addExtraClass('widthFixedLarge')
                                                ->addExtraClass('tagsClear')
                                                ->addExtraClass('optionset')
                                                ->setAttribute('data-bind', 'checked: promotionCode')
                                        //->setSmallFieldHolderTemplate('OptionsetField_Table')
                                        ,
                                        FieldGroup::create(
                                                TextField::create('PulsePromotionCodeValue', '')
                                                        ->setAttribute('placeholder', ($promo)? $promo:'Your promotion code')
                                                        ->setDescription('Please enter your promotional code')
                                                        ->addExtraClass('textField')
                                                        ->setValue($promo)
                                                        ->setAttribute('data-bind', 'value: promotionCodeValue')
                                                ,
                                                LiteralField::create('Controls', '
                                <div>
                                    <a href="#" class="btn green adBtnLarge promoSubmit">Submit<span class="submit"></span></a>
                                </div>
                                                ')
                                                        ->addExtraClass('btnField'),
                                                LiteralField::create('success_message', '
                                    <p class="greenBlockHeading">Congratulations. We will add this promotion to your account.</p>
                                                ')->addExtraClass('codeSuccess')
                                        )
                                                ->addExtraClass('innerSection')
                                                ->addExtraClass('singleTextField')
                                                ->setSmallFieldHolderTemplate('FormField_holder_small') // Uses the default holder Small template
                                )->setFieldHolderTemplate("MultiBlock_FieldGroup_holder")
                                 ->addExtraClass('promoCodeSection'),
                                FieldGroup::create(
                                        TextField::create('Suburb', SignUpTab1::_tPlain('Address,ICP Screen - Q2 title', 'What is your address?'))
                                                ->setAttribute('placeholder', 'eg. 14 Grove Rd, Kelburn, 0620, Wellington')
                                                ->setAttribute('data-bind', "value: userSuburb, valueUpdate:['afterkeydown','propertychange','input', 'blur']")
                                                ->setAttribute('data-api-url', $this->Link())
                                                ->setSmallFieldHolderTemplate("SearchField_holder"),
                                        HiddenField::create('street_number'),
                                        HiddenField::create('street_alpha'),
                                        HiddenField::create('unit_identifier'),
                                        HiddenField::create('street'),
                                        HiddenField::create('suburb'),
                                        HiddenField::create('city'),
                                        HiddenField::create('region'),
                                        HiddenField::create('postcode')

                                ),
                                FieldGroup::create(
                                        SignUpTab1::_tPlain('Address,ICP Screen - Q3 title', 'Your ICP Number'),
                                        AdvOptionsetField::Create('CustomerICPNumber', '<span class="icp-result"></span>', array(
                                                'Yes' => 'Yes',
                                                'Enter' => 'Enter my own ICP',
                                                'No' => 'No'
                                        ))
                                                ->setRightTitle(SignUpTab1::_tPlain('Address,ICP Screen - Q3 question', 'Does this ICP match the property you were searching for? (If you would like to check your ICP number you should be able to find this on a recent electricity bill).'))
//                                                ->setRightTitle('Does this ICP match the property you were searching for? Click <a href=\'/sign-up/how-to-find-your-icp\' target=\'_blank\'>here</a> or <a href=\'#\' data-reveal-id=\'myICP\'\ data-reveal>here</a> if you need to locate your ICP number on your current bill')
                                                ->addExtraClass('widthFixedLarge')
                                                ->addExtraClass('tagsClear')
                                                ->addExtraClass('optionset')//,
                                )
                                        ->setDescription('Based on your address we have been able to determine your ICP number, a unique number associated to your house that we use to give you the best price available.')
                                        ->addExtraClass('icpDisplaySection')
                                        ->setFieldHolderTemplate("MultiBlock_FieldGroup_holder"),

                                FieldGroup::create(
                                        LiteralField::create('Business Message', '
<label class="left"></label>
<p><b>This ICP appears to belong be a non-residential property. Please fill out the form below and we will be in contact with you.</b></p>
                                                                                             ')
                                )
                                        ->addExtraClass('businessSection'),

                                FieldGroup::create(
                                        LiteralField::create('Can\'t Find ICP', '
<label class="left">Let\'s try again</label>
<p>We could not automatically find your ICP from the address you have provided above.</p>


                                                                      ')
                                )
                                        ->addExtraClass('missingICPSection'),

                                FieldGroup::create('To get accurate online pricing we need your ICP Number from a recent bill',
                                        TextField::create('ICP_Number', '')
                                                ->setAttribute('placeholder', 'Something like 0001234567AB0B5')
                                                ->setAttribute('data-bind', "")
                                                ->addExtraClass('textField')
                                                ->setDescription('Please enter your ICP Number')
                                        //->setDescription('Please enter your ICP Number')
                                        ,
                                        LiteralField::create('Controls', '
                                <div>
                                <a href="#" class="btn blue adBtnLarge icpSubmit">Submit<span class="submit"></span></a>
                                </div>
                                        ')
                                                ->addExtraClass('btnField')
                                //,
//                                        LiteralField::create('success_message', '
//                                <p class="greenBlockHeading">Congratulations. Your ICP Was entered.</p>
//                                        ')
//                                                ->addExtraClass('codeSuccess')
//                                                ->addExtraClass('innerSection hidden')
//                                                ->addExtraClass('singleTextField')
//                                                ->setSmallFieldHolderTemplate('FormField_holder_small')
                                )
                                        //->setFieldHolderTemplate("MultiBlock_FieldGroup_holder")
                                        ->addExtraClass('openSection')
                                        ->addExtraClass('singleTextField')
                                        ->setDescription('You should be able to find your ICP Number on the top right hand side of most energy bills')
                                        //->setLeftTitle('Please enter the ICP Number from a previous bill')
                                        ->setAttribute('data-bind', '')
                                        ->addExtraClass('icpSubmitSection')


                        )->addExtraClass('tabBlock')->setRightTitle($this->Content),
                        Tab::create(
                                $title = 'Electricity use, Pricing',
                                FieldGroup::create(SignUpTab2::_tPlain('Electricity use,pricing - Q1 title', 'Electricity Use'),
                                        TextField::create('BillSize', '')
                                                ->setAttribute('placeholder', '$0.00')
                                                ->addExtraClass('billAmount')
                                                ->setDescription('Bill Total')
                                        ,
//                                        DropdownField::create('MonthBillReceived', '', array(
//                                                'placeholder' => 'Select the month you received the bill',
//                                                'Jan' => 'January',
//                                                'Feb' => 'February',
//                                                'Mar' => 'March',
//                                                'Apr' => 'April',
//                                                'May' => 'May',
//                                                'Jun' => 'June',
//                                                'Jul' => 'July',
//                                                'Aug' => 'August',
//                                                'Sep' => 'September',
//                                                'Oct' => 'October',
//                                                'Nov' => 'November',
//                                                'Dec' => 'December'
//                                        ))
                                        TextField::create('MonthBillReceived','' )  //,date("M", strtotime("-1 month"))
                                                ->setAttribute('placeholder', 'Choose the month the bill was recieved')
                                                ->setDescription('Month Bill Received')
                                                ->addExtraClass('dropdown billMonth'),
                                        HiddenField::create('UserTypeAPISelected'),
                                        HiddenField::create('UserTypeUserSelected')
                                )->addExtraClass('openSection')
                                        ->addExtraClass('textFieldsOnly')
                                        ->setDescription(SignUpTab2::_tPlain('Electricity use,pricing - Q1 text', 'We need to know how much electricity you use to determine the best price plan for you'))
                                        ->setLeftTitle(SignUpTab2::_tPlain('Electricity use,pricing - Q1 Description', 'Approximately how much was the last electricity bill you can recall?'))
                                        ->setAttribute('data-bind', ''),
                                FieldGroup::create(
                                        $PricePlan = AdvOptionsetField::create('PricePlan', SignUpTab2::_tPlain('Electricity use,pricing - Q2 title', 'Your Price Plan'), array(
                                                'All Day Price' => array('All Day', '15 Cents'),
                                                'Day/Night' => array('Day / Night', '20 Cents')
                                        ))
                                                ->addExtraClass('widthFixedLarge')
                                                ->addExtraClass('tagsInline')
                                                ->addExtraClass('optionset')
                                                ->setAttribute('data-bind', 'checked: pricePlan')
                                                ->setDescription(SignUpTab2::_tPlain('Electricity use,pricing - Q2 Description', 'Depending on the type of meter installed in your home, you may have a flat price for all energy used in a day or have a day/night price.')),
                                        HiddenField::create('SmartMeter'),
                                        HiddenField::create('MeterArray'),
                                        HiddenField::create('ICPRegAddress')

                                )
                                        ->addExtraClass('pricePlanSection')
                                ,
                                FieldGroup::create(
                                        LiteralField::create('GreatNewsBlock_1', SSViewer::execute_template(SSViewer::getTemplateFileByType('GreatNewsBlock1', 'Form_Content'), '')->value)->addExtraClass('cta1'),
                                        LiteralField::create('GreatNewsBlock_2', SSViewer::execute_template(SSViewer::getTemplateFileByType('GreatNewsBlock2', 'Form_Content'), '')->value)->addExtraClass('cta2'),
                                        HiddenField::create('Network_Provider')
                                )->addExtraClass('ctaSection')
                        ),
                        Tab::create(
                                $title = 'Cool for School, Electronic Services, Smoothpay',
                                FieldGroup::create(
                                        LiteralField::create('PaymentOptions_Ad_1', '<div class="block"><div class="table-layout full"><div class="table-row"><div class="table-cell middle"><div class="rightArrow"></div></div><div class="table-cell middle green"><p class="ctaBold">' . SignUpTab3::_tPlain('Green Box 1 text', 'Pulse Cool for School Programme is our way of giving back to New Zealand families. Our aim is to give $5 million dollars to New Zealand schools over the next 5 years.') . '</p></div></div></div></div>')
                                                ->addExtraClass('cta3')
                                                ->addExtraClass('clearfix'),
                                        AdvOptionsetField::Create('PulseSchool', SignUpTab3::_tPlain('Services,SmoothPay - Q1 title', 'Pulse Cool for School Programme'), array(
                                                'Yes' => 'Yes, I would like to choose a school',
                                                'Choose For Me' => 'Choose a local school on my behalf',
                                                'Decide Later' => 'Decide Later'
                                        ))
                                                ->addExtraClass('widthFixedLarge')
                                                ->addExtraClass('tagsClear')
                                                ->addExtraClass('optionset')
                                                ->setDescription(SignUpTab3::_tPlain('Services,SmoothPay - Q1 Subtext', "Pulse Energy would like to donate $50 to a school of your choice every year you remain a loyal customer of Pulse Energy?"))
                                                ->setAttribute('data-bind', 'checked: chooseSchool')
                                        ,
                                        TextField::create('School', 'Search for a school')
                                                ->setAttribute('placeholder', 'eg. Kelston Primary')
                                                ->addExtraClass('innerSection')
                                                ->setAttribute('data-bind', "value: chooseSchoolSearch, valueUpdate:['afterkeydown','propertychange','input', 'blur']")
                                                ->setLeftTitle('<a href="#" class="textLink schoolLink">Can\'t find the school you\'re after?</a>')
                                                ->setSmallFieldHolderTemplate("SearchField_holder"),
                                        FieldGroup::create(

                                                TextField::create('SchoolName', 'School Name')->setAttribute('placeholder', 'School Name')->setSmallFieldHolderTemplate('SchoolField_holder_small')
                                                ,
                                                CheckboxSetField::create('SchoolLevel', 'School Level', array(
                                                        'Primary' => 'Primary',
                                                        'Intermediate' => 'Intermediate',
                                                        'Secondary' => 'Secondary'
                                                ))->setTemplate('StdCheckboxSetField')->setSmallFieldHolderTemplate('SchoolField_holder_small')
                                        )->setDescription(SignUpTab3::_tPlain("School can\'t find message", "Sorry you can't find your school on our list. Fill out some details below so we can locate your school of choice."))
                                                ->addExtraClass('subBlock')
                                                ->addExtraClass('notFound')
                                )
                                        ->setFieldHolderTemplate("School_FieldGroup_holder")
                                        ->addExtraClass('openSection'),
                                FieldGroup::create(
                                        LiteralField::create('PaymentOptions_Ad_2', '<div class="block"><div class="table-layout full"><div class="table-row"><div class="table-cell middle"><div class="rightArrow"></div></div><div class="table-cell middle green"><p class="ctaBold">' . SignUpTab3::_tPlain('Green Box 2 text', 'You can save money by using our electronic services.') . '</p></div></div></div></div>')
                                                ->addExtraClass('cta3')
                                                ->addExtraClass('clearfix'),
                                        CheckboxSetField::Create('ElectronicServices', SignUpTab3::_tPlain('Services,SmoothPay - Q2 title', 'Electronic Services'), array(
                                                'OnlineBill' => SignUpTab3::_tPlain('Services,SmoothPay - Q2 Option 1', 'Yes I would like to receive and pay my bill online to receive a 0.02 cents per kWh discount each month'),
                                                'DirectDebit' => SignUpTab3::_tPlain('Services,SmoothPay - Q2 Option 2', 'Yes I would like to pay by Direct Debit and receive a $2 discount each month'),
                                                'No' => SignUpTab3::_tPlain('Services,SmoothPay - Q2 Option 3', 'No thanks')
                                        ))
                                                ->addExtraClass('widthFixedLarge')
                                                ->addExtraClass('tagsClear')
                                                ->addExtraClass('optionset')
                                                ->setTemplate('AdvCheckboxSetField')
                                                ->setAttribute('data-bind', 'checked:servicesChecked,  click: updateCheckboxesArray.bind($data)')
                                                ->setAttribute('Note', 'We will send the information you need to access these features in your Welcome Pack')
                                                ->setDescription(SignUpTab3::_tPlain('Services,SmoothPay - Q2 Description', 'Would you like the following electronic services to save more on your electricity bill?'))
                                )
                                        ->addExtraClass('widthFixedLarge')
                                        ->addExtraClass('tagsClear')
                                        ->addExtraClass('optionset')
                                ,
                                FieldGroup::create(
                                        LiteralField::create('PaymentOptions_Ad_3', '<div class="block"><div class="table-layout full"><div class="table-row"><div class="table-cell middle"><div class="rightArrow"></div></div><div class="table-cell middle green"><p class="ctaBold">' . SignUpTab3::_tPlain('Green Box 3 text', 'SmoothPay uses Direct Debit to spread your electricity payments evenly throughout the year, so you pay the same amount each time.') . '</p></div></div></div></div>')
                                                ->addExtraClass('cta3')
                                                ->addExtraClass('clearfix'),
                                        AdvOptionsetField::create('SmoothPay', SignUpTab3::_t('Services,SmoothPay - Q3 title', 'SmoothPay'), array(
                                                'Yes' => array(SignUpTab3::_t('Services,SmoothPay - Q3 Option 1', 'Yes I would like to add SmoothPay and pay the same amount each time'), 'Even Payments'),
                                                'No' => SignUpTab3::_tPlain('Services,SmoothPay - Q3 Option 2', 'I don\'t mind if my payments are different each time '),
                                        ))
                                                ->setAttribute('data-bind', 'checked:smoothPay')
                                                ->addExtraClass('widthFixedLarge')
                                                ->addExtraClass('tagsClear')
                                                ->addExtraClass('optionset')
                                                ->setDescription(SignUpTab3::_tPlain('Services,SmoothPay - Q3 Description', 'Would you like your payments to be the same every time, or go up and down with your electricity use?'))
                                                ->setRightTitle('Choosing SmoothPay as your payment option will ensure you receive the Direct Debit Discount of $2 every month.')
                                                ->setAttribute('Note', 'We will send the information you need to access these features in your Welcome Pack')
                                        ,
                                        AdvOptionsetField::create('SmoothPayFrequency', SignUpTab3::_t('Services,SmoothPay - Q4 title', 'SmoothPay - Payment Frequency'), array(
                                                'Weekly' => 'Weekly',
                                                'Fortnightly' => 'Fortnightly',
                                                'Monthly' => 'Monthly'
                                        ))
                                                ->setAttribute('data-bind', 'checked:smoothPayFrequency')
                                                ->setRightTitle('As a SmoothPay customer you can choose your preferred payment frequency. How often would you like to make payments?')
                                                ->addExtraClass('widthFixedLarge')
                                                ->addExtraClass('tagsClear')
                                                ->addExtraClass('optionset')
                                                ->addExtraClass('innerSection')

                                )
                                        ->addExtraClass('widthFixedLarge')
                                        ->addExtraClass('tagsClear')
                                        ->addExtraClass('optionset')
                                        ->setAttribute('data-bind', 'checked:budgetBuddyOption')
                        )
                )->setLeftTitle('') // gets some unused top content into top tabe scope)
                ,
                FieldGroup::create(
                        TextField::create('CustomerPhoneNumber', '')
                                ->setAttribute('placeholder', 'Your phone number')
                        ,
                        DropdownField::create('BestTimeToContact', '', array(
                                'Morning' => 'Morning',
                                'Afternoon' => 'Afternoon',
                                'Evening' => 'Evening'
                        ))->setEmptyString('Best time to call')->setAttribute('required', 'required'),
                        LiteralField::create('Submit', '
                    <div>
                        <input type="submit" name="action_doSignUp" value="Submit" class="btn green adBtnLarge stopFormSubmit">
                    </div>
                        ')->addExtraClass('btnField'),
                        HiddenField::create('Cancellation_Reason')
                )
                        ->addExtraClass('stopFormBlock')
                        ->addExtraClass('textFieldsOnly')
                        ->addExtraClass('cta2')
// Follwing text now in Cancellation_fieldGroup_holder.ss

//                        ->setDescription('
//                    We will need to speak to you to get some more information. <br/> Our friendly Customer Service team can help you build your Freedom Plan over the phone.
//                    <!--<br><p class="textLarge">Phone: 0800 785 733 or Email: <a href="mailto:joinus@pulseenergy.co.nz?subject=Join Pulse">joinus@pulseenergy.co.nz</a></p>-->')


//                        ->setLeftTitle('
//                        <span class="icp-display table-layout partial">
//                        <span class="table-row">
//                        <span class="table-cell middle green">Phone</span>
//                        <span class="table-cell middle">0800 785 733</span>&nbsp;&nbsp;&nbsp;
//                        <span class="table-cell middle green">Email</span>
//                        <span class="table-cell middle"><a href="mailto:joinus@pulseenergy.co.nz?subject=Join Pulse">joinus@pulseenergy.co.nz</a></span>
//                        </span>
//                        </span>
//                        Would you like us to call you?'
//                        )
                        ->setFieldHolderTemplate("Cancellation_FieldGroup_holder"),
                LiteralField::create('Controls', '
                <div class="controls">
                    <a href="#" class="btn btnLarge green backTab disabled">Back<span class="continue-back"></span></a>
                    <a href="#" class="btn btnLarge grey resetBtn">Reset<span class="reset"></span></a>
                    <a href="#" class="btn btnLarge blue nextTab disabled">Continue<span class="continue"></span></a>
                </div>
            ')
        );

        //======================= Generate Summary Tab ======================================
        $newtab = Tab::create($name = 'summary', $title = 'Check Your Plan');

        //Fieldlists to hold the content for the two tabs
        $fieldlist = FieldList::create();
        // Loads the summary structure from a template SummaryTab.ss
        $fieldlist->push(LiteralField::create('School', SSViewer::execute_template(SSViewer::getTemplateFileByType('SummaryTab', 'Form_Content'), '')->value));
        $newtab->setChildren($fieldlist)->addExtraClass('tabBlock');
        $fields->addFieldsToTab('Sign_up', $newtab);
        //======================= Summary Tab ends ======================================


        //======================= Generate Application form Tab ======================================
        // Final tab to hold the application form.
        $finaltab = Tab::create($name = 'application_form', $title = 'Join Pulse')->addExtraClass('tabBlock');
        $finaltab_fieldlist = FieldList::create(LiteralField::create('Application_opening_div', '<div class="section application openSection">'));
        $index = $index2 = 0;
        ////Iterates over the list of userform fields defined through the CMS
        foreach ($this->Fields() as $fld) {
            $dont_push_field = false;
            $rendered_field = $fld->getFormField();
            // adds the extra css classes to the field
            $rendered_field->setRightTitle($fld->getSetting('ExtraClass'));

            //-------------------------- CUSTOM FORMATTING BY TYPE
            // TEXTFIELD
            if ($rendered_field->Type() == 'text' || $rendered_field->Type() == 'email text') {
                $rendered_field->setAttribute('placeholder', $rendered_field->Title());
            }

            // DATEFIELD
            if ($rendered_field->Type() == 'date text'||$rendered_field->Type() == 'dateNZ text') {
            //new mod
                $rendered_field->setRightTitle("input310");
                $rendered_field->setAttribute('placeholder','dd/mm/yyyy');

            //    $this->generate_dd($rendered_field->Title(), $finaltab_fieldlist);
            //    $dont_push_field = true;
            }

            //LabelField
            //Trigger divs creation from the defined LabelFields, Each LabelField Closes a Div and opens a new one before it
            if (get_class($rendered_field) == 'HeaderField') {
                if ($index == 0) {
                    $finaltab_fieldlist->push(LiteralField::create('new_div', '<div class="section application">'));
                    $index2 = 0;
                }
                else {
                    $finaltab_fieldlist->push(LiteralField::create('new_div', '</div><hr><hr></div><div class="section application">'));
                    $index2 = 0;
                }
                $index++;
            }
            elseif (get_class($rendered_field) == 'LabelField') {
                $fld_uniq_name = 'field_' . str_replace(' ', '', ucwords('Application_' . $fld->Title));
                //If this is the first Label then just open a new div
                if ($index2 == 0) {
                    $finaltab_fieldlist->push(LiteralField::create('new_div', '<div class="field ' . $fld->getSetting('ExtraClass') . '" id="' . $fld_uniq_name . '">'));
                }
                else {
                    $finaltab_fieldlist->push(LiteralField::create('new_div', '</div><div class="field ' . $fld->getSetting('ExtraClass') . '"  id="' . $fld_uniq_name . '">'));
                }
                $index2++;
            }
            //-------------------------- END CUSTOM FORMATTING BY TYPE

            // Sets the Field ID from its name, strips out special Chars and check for duplications
            $field_name = Convert::raw2att(str_replace(' ', '', ucwords('Application_' . $fld->Title)));
            $rendered_field->setName($this->setField_Name($field_name, $finaltab_fieldlist));

            //Render userforms with this custom formfield holder template
            $rendered_field->setFieldHolderTemplate("ApplicationFormField_holder");

            if ($fld->Required) {
                $rendered_field->setAttribute('required', 'required');
            }
            if (!$dont_push_field)
                $finaltab_fieldlist->push($rendered_field);
        }
        $finaltab_fieldlist->push(LiteralField::create('Application_closing_div', '</div></div></div>'));
        $finaltab->setChildren($finaltab_fieldlist);
        $fields->addFieldsToTab('Sign_up', $finaltab);
        //======================= Generate Application form Tab ends ======================================
        //
        // Create actions
        $actions = FieldList::create(
                LiteralField::create('Controls', '<a href="#" class="btn btnLarge grey btnCancel">Cancel</a>'),
                FormAction::create('doSignUp', 'Join Pulse')
                        ->addExtraClass('btn')
                        ->addExtraClass('btnLarge')
        );


        //Add other validators
//        $validator->addRequiredField("Suburb");
//ChromePhp::log($validator);

        // generate the conditional logic (added from UserDefinedForm)
        //$this->generateConditionalJavascript();    NOW HARDCODED


        //Generates the tags for all the advoptionset fields
        $this->generateTags($fields);
        return new Form($this, 'SignUpForm', $fields, $actions, $validator);
    }

    /*
     * Sign Up form submit function.
     */
    public function doSignUp($data, $form) {
        require_once('FirePHPCore/fb.php');

        $signupEmail = Config::inst()->get('SignUp','signupemail');
        $failEmail = Config::inst()->get('SignUp','failemail');
        //var_dump("se ".$signupEmail." fe ".$failEmail);

        $submission = new SignUpSubmission();
        $data_toSave = $form->getData();
//        var_dump($data_toSave);
        $meterArray = json_decode($data_toSave['MeterArray']);
//        var_dump($meterArray);
        $meterString = "";
        if (!empty($meterArray)) {
            foreach ($meterArray as $meter) {
                for ($i = 0; $i < count($meter); $i++) {
                    if ($i != 1) $meterString .= $meter[$i] . ' ';
                }
                $meterString .= "<br>";
            }
        }
//var_dump($meterString);
        $clientMeterString = "";
        $meternum = 1;
        $pricePlanTitle = "Your Freedom Plans";
        if (!empty($meterArray)) {
            if(count($meterArray)==1) $pricePlanTitle = "Your Freedom Plan";
            foreach ($meterArray as $meter) {

                $clientMeterString .= "<table width=\"100%\" style=\"width:100%\"><tr>";
//                for ($i = (count($meter) - 1); $i >= 0; $i--) {
                for ($i = 0; $i < count($meter); $i++) {
                    //var_dump($meter[$i]);
                     if ($i == 2) {
                        $clientMeterString .= '<td width="40%" valign="middle"'
                                . 'style="border:1px solid #2284a1;background-color:#2284a1;padding:7px;'
                                . 'word-break:break-word;padding:7px;vertical-align:middle;text-align:center;color:#222222;'
                                . 'font-family:Helvetica,Arial,sans-serif;font-weight:normal;margin:0;line-height:19px;'
                                . 'font-size:14px;width:40% !important;height:25px;border-collapse:collapse">'
                                . '<a style="color:#ffffff;background-color:#2284a1;'
                                . 'line-height:19px;text-decoration:underline;text-align:center"'
                                . 'href="assets/Uploads/pricing-pdf/' . $meter[$i] . '.pdf">'
                                . 'Price Plan '.$meternum.'</a></td>';
                    }
                    if ($i == 4) {
                         $clientMeterString .= '<td width="60%" valign="middle" style="border:1px solid #2284a1;background-color:#ffffff;padding:7px 0px;'
                                 . 'word-break:break-word;vertical-align:middle;text-align:center;color:#222222;'
                                 . 'font-family:Helvetica,Arial,sans-serif;font-weight:normal;margin:0;line-height:19px;'
                                 . 'font-size:14px;width:60% !important;height:25px;border-collapse:collapse">'
                                 . '<a style="color:#000000;background-color:#ffffff;'
                                 . 'line-height:19px;text-decoration:underline;text-align:center"'
                                 . 'href="assets/Uploads/pricing-pdf/' . $meter[2] . '.pdf">'
                                 . 'Meter ID: ' . $meter[$i] . '</a></td>';
                     }
                }
                $clientMeterString .= "</tr></table>";
            }
            $meternum++;
        }
//        var_dump($clientMeterString);
        unset($data_toSave['SecurityID']);

        $json_str = Convert::array2json($data_toSave);

        // Debugging
        //var_dump($data_toSave);
        $form->saveInto($submission);

        $submission->setField('FormData', $json_str);


        $submission->setField('ICPNumber', $data_toSave['ICP_Number']);
        $submission->setField('ICPNumberMatch', $data_toSave['CustomerICPNumber']);
        $submission->setField('NetworkProvider', $data_toSave['Network_Provider']);
        $submission->setField('Cancellation_Reason', $data_toSave['Cancellation_Reason']);
        $submission->setField('HasPromotionCode', $data_toSave['PulsePromotionCode']);
        $submission->setField('PromotionCode', $data_toSave['PulsePromotionCodeValue']);
        $submission->setField('Address', $data_toSave['Suburb']);

        $record_number = $submission->write();

        if(empty($data_toSave['Cancellation_Reason'])){
        //Admin email part if its not an incomplete one

                $adminEmailBody = "<style type=\"text/css\">table, h1{font-family:arial, helevetica, sans-serif}</style>"
                        . "<h1>Pulse Energy Online Application " . $record_number . "</h1>"
                        . "<table cellpadding=\"5\" border=\"1\">"
                        . "<tr><td><b>Item</b></td><td><b>Value</b></td></tr>"
                        . "<tr><td>Previous Account (If Yes)</td><td>" . $data_toSave['Application_prev_acct'] . "</td></tr>"
                        . "<tr><td>Title</td><td>" . $data_toSave['Application_Title'] . "</td></tr>"
                        . "<tr><td>First Name</td><td>" . $data_toSave['Application_FirstName'] . "</td></tr>"
                        . "<tr><td>Last Name</td><td>" . $data_toSave['Application_LastName'] . "</td></tr>"
                        . "<tr><td>Date of Birth<br>yyyy-mm-dd</td><td>"
//                        . $data_toSave['Application_dob_Day'] . "/"
//                        . $data_toSave['Application_dob_Month'] . "/"
                        . $data_toSave['Application_dob'] . "</td></tr>"
                        . "<tr><td>Phone Num</td><td>" . $data_toSave['Application_YourPhoneNumber'] . "</td></tr>"
                        . "<tr><td>Email</td><td>" . $data_toSave['Application_YourEmailAddress'] . "</td></tr>"
                        . "<tr><td>Drivers Licence Yes/No</td><td>" . $data_toSave['Application_DriversLicenceChoice'] . "</td></tr>"
                        . "<tr><td>Drivers Licence Number</td><td>" . $data_toSave['Application_DriversLicenseNumber(5A)'] . "</td></tr>"
                        . "<tr><td>Drivers Licence Version</td><td>" . $data_toSave['Application_DriversLicenseVersion(5B)'] . "</td></tr>"
                        . "<tr><td>Passport Number</td><td>" . $data_toSave['Application_PassportNumber'] . "</td></tr>"
                        . "<tr><td>Account Name </td><td>" . $data_toSave['Application_AccountName'] . "</td></tr>"
                        . "<tr><td>Residential</td><td>Residential</td></tr>"
                        . "<tr><td>Low/Standard User</td><td>" . $data_toSave['UserTypeAPISelected'] . "</td></tr>"
                        . "<tr><td>Alternative Person</td><td>" . $data_toSave['Application_FirstName2'] . " " . $data_toSave['Application_LastName2'] . "</td></tr>"
                        . "<tr><td>DOB Alternative Person</td><td>"
//                        . $data_toSave['Application_DOB_Alternative_Day'] . "/"
//                        . $data_toSave['Application_DOB_Alternative_Month'] . "/"
                        . $data_toSave['Application_DOB_Alternative'] . "</td></tr>"
                        . "<tr><td>Alternative Phone Num</td><td>" . $data_toSave['Application_AlternativePhoneNumber'] . "</td></tr>"
                        . "<tr><td>Billing Address Different?</td><td>" . $data_toSave['Application_postal_address'] . "</td></tr>"

                        . "<tr><td>Addressfinder PAF Address</td><td>"
                        . $data_toSave['unit_identifier'] . "<br>"
                        . $data_toSave['street_number'] . $data_toSave['street_alpha'] . " "
                        . $data_toSave['street'] . "<br>"
                        . $data_toSave['suburb'] . "<br>"
                        . $data_toSave['city'] . "<br>"
                        . $data_toSave['postcode'] . "<br>"
                        . $data_toSave['region'] . "</td></tr>"

                        . "<tr><td>Install Address</td><td>" . $data_toSave['Application_HouseNumberAndStreetName'] . "<br>"
                        . $data_toSave['Application_HouseNumberAndStreetName2'] . "<br>"
                        . $data_toSave['Application_Suburb'] . "<br>"
                        . $data_toSave['Application_City'] . "</td></tr>"

                        . "<tr><td>Billing Address</td><td>" . $data_toSave['Application_HouseNumberAndStreetName2'] . "<br>"
                        . $data_toSave['Application_Suburb2'] . "<br>"
                        . $data_toSave['Application_CityAndPostcode'] . "</td></tr>"

                        . "<tr><td>Current ICP Address</td><td>"
                        . $data_toSave['ICPRegAddress'] . "<br>"
                        . "</td></tr>"

                        . "<tr><td>ICP Number</td><td>" . $data_toSave['ICP_Number'] . "</td></tr>"
                        . "<tr><td>Price Plan</td><td>" . $data_toSave['PricePlan'] . "</td></tr>"
                        . "<tr><td>Network Provider</td><td>" . $data_toSave['Network_Provider'] . "</td></tr>"
                        . "<tr><td>Smart meter</td><td>" . $data_toSave['SmartMeter'] . "</td></tr>"
                        . "<tr><td>Meter Array</td><td>" . $meterString . "</td></tr>"
                        . "<tr><td>Electronic Services</td><td>" . $data_toSave['ElectronicServices'] . "</td></tr>"
                        . "<tr><td>SmoothPay</td><td>" . $data_toSave['SmoothPay'] . "</td></tr>"
                        . "<tr><td>SmoothPay Frequency</td><td>" . $data_toSave['SmoothPayFrequency'] . "</td></tr>"
                        . "<tr><td>School</td><td>" . $data_toSave['School'] . "</td></tr>"
                        . "<tr><td>School Level</td><td>" . $data_toSave['SchoolLevel'] . "</td></tr>"
                        . "<tr><td>School Name</td><td>" . $data_toSave['SchoolName'] . "</td></tr>"
                        . "<tr><td>Bill Size</td><td>" . $data_toSave['BillSize'] . "</td></tr>"
                        . "<tr><td>Medically Dependent</td><td>" . $data_toSave['Application_anyone_medically_dependant'] . "</td></tr>"
                        . "<tr><td>Meter Location</td><td>" . $data_toSave['Application_WhereIsYourMeterLocated'] . "</td></tr>"
                        . "<tr><td>Is there a Dog</td><td>" . $data_toSave['Application_dog_on_property'] . "</td></tr>"
                        . "<tr><td>Type of Dog</td><td>" . $data_toSave['Application_dog_nature'] . "</td></tr>"
                        . "<tr><td>Moving House</td><td>" . $data_toSave['Application_moved_recently'] . "</td></tr>"
//                          . "<tr><td>Moving Date</td><td>" . $data_toSave['Application_move_in_date_Day'] . "/" . $data_toSave['Application_move_in_date_Month'] . "/" . $data_toSave['Application_move_in_date_Year'] . "</td></tr>"
                        . "<tr><td>Moving Date</td><td>" . $data_toSave['Application_move_in_date'] . "</td></tr>"
                        . "<tr><td>Promo Code</td><td>" . $data_toSave['PulsePromotionCodeValue'] . "</td></tr>"
                        . "</table>";

                //var_dump($adminEmailBody);

                $adminEmail = new Email('signup@pulseenergy.co.nz', $signupEmail, 'Pulse Energy Application', $adminEmailBody);
                $adminEmail->setCc('julian2@bitstream.co.nz');
                $adminEmail->send();
        }
        else{
            $adminEmailBody = "<style type=\"text/css\">table, h1, h2{font-family:arial, helevetica, sans-serif}</style>"
                    . "<h1>Pulse Energy Online Application " . $record_number . "</h1></h1><br><h2>Incomplete Application</h2><br>"
                    . "<table cellpadding=\"5\" border=\"1\">"
                    . "<tr><td><b>Item</b></td><td><b>Value</b></td></tr>"
                    . "<tr><td>Reason for non-completion</td><td>" . $data_toSave['Cancellation_Reason'] . "</td></tr>"
                    . "<tr><td>Customer Name</td><td>" . $data_toSave['CustomerName'] . "</td></tr>"
                    . "<tr><td>Phone Number</td><td>" . $data_toSave['CustomerPhoneNumber'] . "</td></tr>"
                    . "<tr><td>Best Time To Contact</td><td>" . $data_toSave['BestTimeToContact'] . "</td></tr>"
                    . "<tr><td>Addressfinder PAF Address</td><td>"
                    . $data_toSave['unit_identifier'] . "<br>"
                    . $data_toSave['street_number'] . $data_toSave['street_alpha'] . " "
                    . $data_toSave['street'] . "<br>"
                    . $data_toSave['suburb'] . "<br>"
                    . $data_toSave['city'] . "<br>"
                    . $data_toSave['postcode'] . "<br>"
                    . $data_toSave['region'] . "</td></tr>"
                    . "<tr><td>Promo Code</td><td>" . $data_toSave['PulsePromotionCodeValue'] . "</td></tr>"
                    . "</table>";

            $adminEmail = new Email('signup@pulseenergy.co.nz', $failEmail, 'Pulse Energy Application Fail', $adminEmailBody);
            $adminEmail->setCc('julian2@bitstream.co.nz');
            $adminEmail->send();

        }

        Session::set('customer_name', $data['CustomerName']);


        $customerEmail = new Email('customer.service@pulseenergy.co.nz', $data_toSave['Application_YourEmailAddress'], 'Welcome to Pulse Energy', '');
       // $customerEmail->setBcc('freedomwithusana@gmail.com');
        $customerEmail->setTemplate('amc');
        $customerEmailArray = array(
                'CustomerName' => $data_toSave['Application_FirstName'],
                'PricePlans' => $clientMeterString,
                'PricePlanTitle' => $pricePlanTitle
        );
        $customerEmail->populateTemplate($customerEmailArray);
        $customerEmail->send();
        if(empty($data_toSave['Cancellation_Reason'])){
        //yes I know its a repeat... it was just easier at the time because of the flow
            return $this->redirect($this->Link() . 'Submitted');
        }
        else{
            return $this->redirect("/we-will-contact-you");
        }

    }

    /**
     * This action handles rendering the "finished" message, which is
     * customizable by editing the FormSubmission template.
     *
     * @return ViewableData
     */
    public function Submitted() {


        $content = $this->renderWith('FormSubmission');

        return $this->customise(array(
                'Content' => $content,
                'Title' => '',
                'SignUpForm' => '',
        ))->renderWith('Page');
        Session::clear('customer_name');
    }

    /**
     * Sets the title for the confirmation page, uses sessions to set the username.
     *
     * @return String
     */
    public function SubmissionTitle() {
        $usr_name = Session::get('customer_name');
        Session::clear('customer_name');
        return 'Welcome to Pulse Energy ' . $usr_name . '!';
    }

    public function getMonthsThresholds() {
        $results = array();
        $results['result'] = array();

        $results['result']['January'] = SignUpTab1::_tPlain('Electricity Usage - January Threshold', 130);
        $results['result']['February'] = SignUpTab1::_tPlain('Electricity Usage - February Threshold', 143);
        $results['result']['March'] = SignUpTab1::_tPlain('Electricity Usage - March Threshold', 156);
        $results['result']['April'] = SignUpTab1::_tPlain('Electricity Usage - April Threshold', 169);
        $results['result']['May'] = SignUpTab1::_tPlain('Electricity Usage - May Threshold', 182);
        $results['result']['June'] = SignUpTab1::_tPlain('Electricity Usage - June Threshold', 195);
        $results['result']['July'] = SignUpTab1::_tPlain('Electricity Usage - July Threshold', 208);
        $results['result']['August'] = SignUpTab1::_tPlain('Electricity Usage - August Threshold', 195);
        $results['result']['September'] = SignUpTab1::_tPlain('Electricity Usage - September Threshold', 182);
        $results['result']['October'] = SignUpTab1::_tPlain('Electricity Usage - October Threshold', 169);
        $results['result']['November'] = SignUpTab1::_tPlain('Electricity Usage - November Threshold', 156);
        $results['result']['December'] = SignUpTab1::_tPlain('Electricity Usage - December Threshold', 130);

        print $result_st = Convert::array2json($results);
    }


// ========================================= API Calls ================================================================
    /**
     * SOAP function to retrieve the ICP number based on an address, this to be called from the front end.
     *
     * @return JSONSting    Returns a JSON string if results exists and nothing otherwise.
     */
    public function getICPNumber($dummyrequest = null, $barCombined = true) {

        //barcombined is re-entrant with addresses like 1-11 left as they are the first pass and tried again as array
        // //include("chromephp/ChromePhp.php");
        require_once('FirePHPCore/fb.php');

        $result_st = '';
        $icp_records = array();
        $request = $this->getRequest();
        $username = 'pulseweb'; //NEVER use this as a web login or the password will begin to expire
        $password = '17harper';

        $decrequest = json_decode($request->postVar("json_data"), true);
//        fb("decoded request");
//        fb($decrequest);
        $streetOrPropertyName = str_replace('street', 'st', strtolower($decrequest['street']));
        $streetOrPropertyName = str_replace('avenue', 'ave', $streetOrPropertyName);

       // $streetOrPropertyName = str_replace('road', 'r', $streetOrPropertyName);
        $roadRegex = "/\srd\s|\sroad/i";
        $streetOrPropertyName = preg_replace( $roadRegex, ' r', $streetOrPropertyName);
        // 20140407 search for st not street as some dont work same for rd and avenue
        $suburbOrTown = null; //$decrequest['suburb'];
        $region = substr($decrequest['region'], 0, -7); //get rid if "region" suffix
        $city = $decrequest['city'];


        $number = (empty($decrequest['number'])) ? null : $decrequest['number'];
        $initial_search_number = $number;
        $unit_identifier = (!empty($decrequest) && (array_key_exists('unit_identifier', $decrequest))) ? $decrequest['unit_identifier'] : null; //3.1415926535;

        // Addressfinder can provide numbers as 1-9 Balmoral Drive Tokoroa. These seem to be industrial and dont come with a unit identifier
        // 1-9 Dublin Street failed on this and then because its in Wairarapa and not wellington `
        $searchNumberArray = explode('-', $number);
        if ((count($searchNumberArray) > 1)) { // && !$barCombined this seemed to wreck it One can never seem to search with "-" even if the registry has it
            $number = $searchNumberArray[count($searchNumberArray) - 1];
            //fb("Number Array");
            //fb($searchNumberArray);
            if ($unit_identifier == null) $unit_identifier = $searchNumberArray[0];
        }
        $alpha = (!empty($decrequest) && (array_key_exists('alpha', $decrequest))) ? $decrequest['alpha'] : null;

        ///fb('region');
        ///fb($region);
        // the registry splits Manawatu Wanaganui and The lines Company causes Manawatu to extend right into the Waikato
        if (strpos($region, 'Manawatu') !== false || strpos($region, 'Wanganui') !== false || strpos($region, 'Waikato') !== false) {
            // fb("manawatu" . '>' . strpos($region, 'Manawatu') . '>' . strpos($region, 'Wanganui'));
            $region = null;
            //only second pass
            if ($barCombined) {
                $suburbOrTown = $decrequest['city']; // the registry seems to use city instead of suburb in this region
            }
            else {
                $suburbOrTown = '';
            }
        }
        elseif (strpos($region, 'Hawke') !== false) {
            $region = 'Hawkes Bay'; // Addressfinder sticks an apostrophe in there
        }
        elseif (($region == 'Wellington') && (!($city == 'Wellington'))) {
            $region = ''; // Addressfinder gloms lots of Wairarapa as Wellingon
        }
        ///fb(strpos($region, 'Hawke'));
        ///fb($region);


        $soap = new SoapClient('https://www.electricityregistry.co.nz/bin_public/Jadehttp.dll?WebService&listName=WSP_Registry2&serviceName=WSRegistry&wsdl=wsdl');

        $params =
                [
                        'userName' => $username,
                        'password' => $password,
                        'unitOrNumber' => $number,
                        'streetOrPropertyName' => $streetOrPropertyName,
                        'streetOrPropertyFilter' => '',
                        'suburbOrTown' => $suburbOrTown,
                        'suburb' => $suburbOrTown,
                        'region' => $region,
                        'isExactMatch' => null,
                        'ownIcpsOnly' => null,
                        'commissionedOnly' => null
                ];
        //fb('$params');
        //fb($params);
        $icpNumber = $soap->icpSearch_v1($params);
        $icp_records['result'] = array();
        //fb($icpNumber);
        // $icp_records['result']['address'] = array();
        $icp_records['address'] = array();
        $searchTownArray = array(strtolower($decrequest['suburb']), strtolower($decrequest['city']));
        $firstStreetMatch = array();
//        $delimiters = array(",", ".", "|", ":", " ");
        $newRegexDelimiters = "/(,?\s+)|((?<=[a-z])(?=\d))|((?<=\d)(?=[a-z]))|\//i"; //added \/ to capture "/"
        // see http://codepad.org/i4Y6r6VS and http://stackoverflow.com/questions/10180730/splitting-string-containing-letters-and-numbers-not-separated-by-any-particular
        ///fb(strpos($icpNumber->message, 'Results'));
        if ((!empty($icpNumber->icpSearch_v1Result->allResults)) && (strpos($icpNumber->message, 'Results') !== false) && ($icpNumber->message != "Results: 0") && ($icpNumber->message != "Max Results encountered")) {
            $results = $icpNumber->icpSearch_v1Result->allResults->WS_ICPSearchResult;

            ///fb('count results - dont put back $results as it crashes ChromePHP. ChromePHP can overload easily');
            //fb(count($results));
            if (is_array($results)) {
                // If the first record is a single match then it will return an non-array
                for ($i = 0; $i < count($results); $i++) {
                    //fb($results[$i]->myAddressHistory->number . '>' . $number . '>' . strcasecmp($results[$i]->myAddressHistory->number, $number) . ($results[$i]->myAddressHistory->number == $number));
                    //the following will also include bothside null street number
                    //It has been observed that some numbers also have the unit in them. Ie 2/16 Ian Graves Close Titahi Bay - or 1-11 Station Road Pukekohe
                    if (!empty($results[$i]->myAddressHistory->number)) {
                        //fb($i);
                        $matchNumber = 0; //default
                        //$delimiterNumberFix = str_replace($delimiters, $delimiters[0], $results[$i]->myAddressHistory->number);
                        // new preg_split version from http://stackoverflow.com/questions/10180730/splitting-string-containing-letters-and-numbers-not-separated-by-any-particular
                        // and http://codepad.org/i4Y6r6VS
                        // first test for '-' since the newregexdelimiters do not work on this
                        if (strpos($results[$i]->myAddressHistory->number, '-') !== false) {
                            $numberArray = explode('-', $results[$i]->myAddressHistory->number);
                         }
                        else {
                            $numberArray = preg_split($newRegexDelimiters, $results[$i]->myAddressHistory->number);
                        }

                        if (isset($results[$i]->myAddressHistory->unit)) {
                            $unitArray = preg_split($newRegexDelimiters, $results[$i]->myAddressHistory->unit);
                        }
                        else {
                            $unitArray = array();
                        }

                        if (isset($results[$i]->myAddressHistory->propertyName)) {
                            $propertyArray = preg_split($newRegexDelimiters, $results[$i]->myAddressHistory->propertyName);
                        }
                        else {
                            $propertyArray = array();
                        }

                           //fb('numberarray');
                           //fb($numberArray);
                        //if $numberArray count is 1 then its the first and only value otherwise the first unless the last is alpha ie 2, 2/22, 22 a
/// 2014 04 04 If barcount is false in second pass then reverse this to see if it was a stupide Rapid 429 as in 429 Kerikeri Road, Kerikeri
                        //actually changed the main code to this in the end. No barcound
                        if (count($numberArray) > 1) {

                            for ($n = 0; $n < count($numberArray); $n++) {
                                //fb($numberArray[$n]);
                                if (!ctype_alpha($numberArray[$n])) {
                                    $matchNumber = $n; // this will gave the last one before an alpha
                                }
                            }
                        }
//                        fb('af1a');
//                        fb($numberArray[$matchNumber]);
//                        fb($number);
                        // now we are using r  ave and st to search this has to change to stripos from strcaasecomp

                        if ((stripos($results[$i]->myAddressHistory->street, $streetOrPropertyName) !== false) && ($numberArray[$matchNumber] == $number)) {
                            //take away the house number to leave units

                            $arrayfix = array();
                            if (count($numberArray) > 1) { //leaves the alpha part
                                unset($numberArray[$matchNumber]);
                                $arrayfix = array_values($numberArray);
//                                fb('af1');
//                                fb($arrayfix);
                            }

                            // gives (hopefully) a house unit identification array
                            // but we must add unit and property name array to this as well as these are used for alpha randomly
                            // $alphaArray = array_merge($arrayfix, $propertyArray, $unitArray);
                            $alphaArray = array_merge($arrayfix, $unitArray);

                            if (empty($alpha) || (!$this->is_array_empty($arrayfix) && in_array($alpha, $alphaArray, true))) {
                                // note the use of the true strict flag so we dont test the numbers in units and so on
                                //if there is no alpha then its already right and if there is an
                                //an alpha it has to be match the array
                                // fb('af4');
                                $firstStreetMatch[] = $results[$i];
                            }
                        }

                    }
                }

                // $firstStreetMatch = (array)$firstStreetMatch;
                // fb('count($firstStreetMatch)');
                // fb(($firstStreetMatch));

                //there may only be one result after this as in the case of 2 Island Bay Road in which case its right
                //The foreach loop won't work with only one entry
                //fb('start of loop 2');
                if (!$this->is_array_empty($firstStreetMatch) && (count($firstStreetMatch) > 1)) {

                    //prepare to at least try to isolate the town. Exception list to be added later. Don't bother id count($results) = 1
                    // Dont forget that street numbers have already been matched so no need to do it again.

                    for ($i = 0; $i < count($firstStreetMatch); $i++) {
                        //fb('I');
                        //fb($i);
                        // foreach ($firstStreetMatch as $streetMatch) {
                        $icp_no = (!empty($firstStreetMatch[$i]->myIcp->icpId)) ? $firstStreetMatch[$i]->myIcp->icpId : 'No ICP Detected';
                        //                       fb($icp_no);
                        $propertyNameCompare = array();
                        $unitNumberCompare = array();
                        $numberCompare = array();

                        //create returned suburb/town array
                        //fb($firstStreetMatch[$i]->myAddressHistory->suburb);
                        //fb($i);

                        $fuzzySearchTown = array();
                        if (isset($firstStreetMatch[$i]->myAddressHistory->suburb)) {
                            $fuzzySearchTown = array_merge($fuzzySearchTown, explode(' ', strtolower($firstStreetMatch[$i]->myAddressHistory->suburb)));
                        }
                        if (isset($firstStreetMatch[$i]->myAddressHistory->town)) {
                            $fuzzySearchTown = array_merge($fuzzySearchTown, explode(' ', strtolower($firstStreetMatch[$i]->myAddressHistory->town)));
                        }

                        //lets score the town example 17 harper street chatswood has another similar street in papakura. Suburb match is higher

                        //$suburbScoreArray = array_intersect($fuzzySearchTown, $searchTownArray);
                        //fb($searchTownArray);fb($fuzzySearchTown);
                        //fb($suburbScoreArray);
                        $suburbScore = 100; // some stupid number that's not null
                        for ($j = 0; $j < count($searchTownArray); $j++) {
                            if (in_array($searchTownArray[$j], $fuzzySearchTown)) {
                                $suburbScore = $j;
                                break;
                            }
                        }
                        ///fb('suburbScore');
                        ///fb($suburbScore);


                        if (isset($firstStreetMatch[$i]->myAddressHistory->unit)) $unitNumberCompare = preg_split($newRegexDelimiters, $firstStreetMatch[$i]->myAddressHistory->unit);

                        if (isset($firstStreetMatch[$i]->myAddressHistory->number)) $numberCompare = preg_split($newRegexDelimiters, $firstStreetMatch[$i]->myAddressHistory->number);

                        if (isset($firstStreetMatch[$i]->myAddressHistory->propertyName) && !$barCombined) { // only do this on second pass
                            if (!((preg_match('/[A-Z]+[0-9]+/', $firstStreetMatch[$i]->myAddressHistory->propertyName) && (strlen($firstStreetMatch[$i]->myAddressHistory->propertyName) == 15)))) {
//                           // a lot of canterbury addresses have the icp in property name
                                $propertyNameCompare = ''; //preg_split($newRegexDelimiters, $firstStreetMatch[$i]->myAddressHistory->propertyName);
                            }
                        }

                        // the registry has units with words in them!!
//                        if (isset($firstStreetMatch[$i]->myAddressHistory->unit)) {
//                            $delimiterNumberFix = str_replace($delimiters, $delimiters[0], $firstStreetMatch[$i]->myAddressHistory->unit);
//                            $dnf = explode(',', $delimiterNumberFix);
//                            $unitNCSum = array_merge($unitNumberCompare, $dnf);
//                            fb('unit');
//                            fb($unitNCSum);
//
//                        }
//                        if (!isset($firstStreetMatch[$i]->myAddressHistory->propertyName)) {
//                            $delimiterNumberFix = str_replace($delimiters, $delimiters[0], $firstStreetMatch[$i]->myAddressHistory->propertyName);
//                            $propertyNameCompare = explode(',', $delimiterNumberFix);
//                        }

                        //first try to match unit
                        // do the same alpha search on this one. Pity we have to do it again but passing this to the array object seemed problematic
                        //if $numberArray count is 1 then its the first and only value otherwise the first unless the last is alpha ie 2, 2/22, 22 a

                        $matchNumberCompare = 0;
                        if (count($numberCompare) > 1) {

                            for ($n = 0; $n < count($numberCompare); $n++) {
                                //fb($numberArray[$n]);
                                if (!ctype_alpha($numberCompare[$n])) {
                                    $matchNumberCompare = $n;
                                }
                            }
                        }
//                        fb('mnc');
//                        fb($matchNumberCompare);
                        //if (count($numberCompare >= 1)) { // dont merges the real street
                        $unitArrayFromNumber = $numberCompare;
                        unset($unitArrayFromNumber[$matchNumberCompare]);
                        $unitNCSum = array_filter(array_merge($unitNumberCompare, $unitArrayFromNumber));

//                        fb('uncsum');
//                        fb($unitNCSum);
//                        fb('unit_id');
//                        fb($unit_identifier);
//                        fb('ins');
//                        fb($initial_search_number);
//                        fb('nc');
//                        fb($numberCompare);
//                        fb('unc');
//                        fb($unitNumberCompare);
//                        fb($propertyNameCompare);


                        // literal check for numbers like 1-11 station road pukekohe on second pass where number returned isn't split
                        // second pass only NOOOOO !$barCombined &&
                        if ((stripos($numberCompare[$matchNumberCompare], '-') != false) && in_array($initial_search_number, $numberCompare)) {

                            // (!$this->is_array_empty($numberCompare) && in_array($initial_search_number, $numberCompare)) {
                            $icp_records['result'][] = $icp_no;
                            $icp_records['address'][] = $firstStreetMatch[$i]->myAddressHistory;
                            $icp_records['score'][] = $suburbScore;
                            fb('literal match');
                            break;
                        }
                        // use the true flag to ensure that it only checks numbers as appropriate
                        elseif (!$this->is_array_empty($unitNCSum) && !empty($unit_identifier) && (in_array($unit_identifier, $unitNCSum, true))) {
                            $icp_records['result'][] = $icp_no;
                            $icp_records['address'][] = $firstStreetMatch[$i]->myAddressHistory;
                            $icp_records['score'][] = $suburbScore;
                            fb('unit number match');
                            break;
                        } // then try to match exploded property name

// second pass only

                        elseif (!$barCombined && !$this->is_array_empty($propertyNameCompare) && !empty($unit_identifier) && in_array($unit_identifier, $propertyNameCompare)) {
                            $icp_records['result'][] = $icp_no;
                            $icp_records['address'][] = $firstStreetMatch[$i]->myAddressHistory;
                            $icp_records['score'][] = $suburbScore;
                            fb('property name match');
                            break;
                        }
                        //and then push this record if it does NOT have any unit or property name entries
                        //to do: BBUUTTT not if there is an unsatisfied unit entry in the search address


///// 2014 04 04 remove property name compare test from the final   && $this->is_array_empty($propertyNameCompare)


                        elseif ($this->is_array_empty($unitNumberCompare) && empty($unit_identifier)) {
                            fb("push plain address");
                            $icp_records['result'][] = $icp_no;
                            $icp_records['address'][] = $firstStreetMatch[$i]->myAddressHistory;
                            $icp_records['score'][] = $suburbScore;
                            // break; 15 Baker Street, Allenton, Ashburton -> 15 Baker Street, New Brighton, Christchurch
                        }
//                        else {
//                            $icp_records['result'][] = $icp_no;
//                            $icp_records['address'][] = $firstStreetMatch[$i]->myAddressHistory;
//                            $icp_records['score'][] = $suburbScore;
//                            fb('btl');
//                        }
                    }
                }
                elseif (!$this->is_array_empty($firstStreetMatch) && count($firstStreetMatch) === 1) {
                    //ok there may have been no number matches but there still might be more than one match - or not.
                    //there was only one so its very likely to be right. Note that the firststreetmatch is still an array (of 1)
                    fb("Single street number match");
                    $icp_records['result'][] = $firstStreetMatch[0]->myIcp->icpId;
                    $icp_records['address'][] = $firstStreetMatch[0]->myAddressHistory;

                }
            }
            else {
                //fb("not array");
                //fb($results);
                // check the street number it might return 911 for input of 91. 91 river road kawerau
                //fb($results->myAddressHistory->number);
                if ($results->myAddressHistory->number == $number) {
                    array_push($icp_records['result'], $results->myIcp->icpId);
                    $icp_records['address'][] = $results->myAddressHistory;
                }
                //fb('result');

            }
        }
        unset($firstStreetMatch);
        //       fb(count($icp_records['result']) . " records found");
//        fb("icp result array");
//        fb(($icp_records['result']));
//        fb(($icp_records['address']));
//        fb(($icp_records['score']));

        //empty formatted string to return to ajax if no results
        $result_st = array('result' => array('null'), 'address' => array('null')); //empty result object - but correct object structure so as to satisfy ajax
        if (!empty($icp_records['result']) && count($icp_records['result']) > 1) {
            $finalChoice = 0;
            //           fb('score');
//        fb(array_search(min($icp_records['score']),$icp_records['score']));
            $finalChoice = array_search(min($icp_records['score']), $icp_records['score']);
//        fb($icp_records['result'][$finalChoice]);fb($icp_records['address'][$finalChoice]);
            $result_st = array('result' => array($icp_records['result'][$finalChoice]), 'address' => array($icp_records['address'][$finalChoice]));

            if (!$barCombined) {
                //fb($result_st);
                return $result_st;
            }
            else {
                print Convert::array2json($result_st);
                return null;
            }
        }
        elseif (count($icp_records['result']) == 1) {
            $result_st = array('result' => array($icp_records['result'][0]), 'address' => array($icp_records['address'][0]));
            //           fb($result_st);
            //           fb('One record Found');
            if (!$barCombined) {
                //               fb($result_st);
                return $result_st;
            }
            else {
                print Convert::array2json($result_st);
                return null;
            }
        }
        else {
            if ($barCombined) {

                $secondResult = $this->getICPNumber(null, false);
                fb('not combined');
                fb($secondResult);
                if (!empty($secondResult)) {
                    print Convert::array2json($secondResult);
                    return null;
                }

            }
            else {
                fb($result_st);
                fb('if all else fails');
                print '{"result":["null"],"address":["null"]}'; //Convert::array2json($secondResult);
                return null;
            }
        }
    }

    public function getNetworkProvider() {
        //require_once('FirePHPCore/fb.php');
        // results array initialisation
        $results = array();
        $results['result'] = array();
        $results['address'] = array();
        $regMeters = true;
        $request = $this->getRequest();
        $username = 'pulseweb'; //NEVER use this as a web login or the password will begin to expire
        $password = '17harper';
        $soap = new SoapClient('https://www.electricityregistry.co.nz/bin_public/Jadehttp.dll?WebService&listName=WSP_Registry2&serviceName=WSRegistry&wsdl=wsdl',
                array('features' => SOAP_SINGLE_ELEMENT_ARRAYS,));

        if ($icpN = $request->postVar('icp')) {
            $params2 = array(
                    array(
                            'userName' => $username,
                            'password' => $password,
                            'icpId' => $icpN,
                            'eventDate' => null
                    )
            );
            //ChromePhp::log('params2');
            //ChromePhp::log($params2);
            $icpDetails = $soap->__soapCall('icpDetails_v1', $params2);
            $meterDetailArray = array();
            //gawd this code was so wrong - there might be more than one metering installation even at the top level
            // so here we go loop loop loop ->MeteringInstallation->allMeteringComponents->MeteringComponent->allMeteringChannels(MeteringChannel);

            //ChromePhp::log($icpDetails->icpDetails_v1Result->myMeteringHistory->allMeteringInstallations);
//            if (!empty($icpDetails->icpDetails_v1Result->myMeteringHistory->allMeteringInstallations->MeteringInstallation->allMeteringComponents->MeteringComponent->allMeteringChannels)) {
            if (!empty($icpDetails->icpDetails_v1Result->myMeteringHistory->allMeteringInstallations)) {
                $regMeters = $icpDetails->icpDetails_v1Result->myMeteringHistory->allMeteringInstallations;
                //$pricingObject = new PricingTable;
                foreach ($regMeters as $MeteringInstallation) {
                    //ChromePhp::log('$MeteringInstallation');
                    // ChromePhp::log($MeteringInstallation);
                    foreach ($MeteringInstallation as $allMeteringComponentsObject) {
                        //ChromePhp::log('allMeteringComponentsObject');
                        //ChromePhp::log($allMeteringComponentsObject);
                        foreach ($allMeteringComponentsObject->allMeteringComponents->MeteringComponent as $MeteringComponentObject) {
                            //ChromePhp::log('$MeteringComponentObject');
                            //ChromePhp::log($MeteringComponentObject);
                            //test for whether the Metering channel has any arrays under it before looping (example 1-11 station road pukekohu which has empty metering components
                            //ChromePhp::log($MeteringComponentObject->allMeteringChannels);
                            if (isset($MeteringComponentObject->allMeteringChannels)) {
                                //ChromePhp::log('$MeteringComponentObject->allMeteringChannels');
                                //ChromePhp::log($MeteringComponentObject->allMeteringChannels);
                                foreach ($MeteringComponentObject->allMeteringChannels->MeteringChannel as $MeteringChannel) {

                                    //ChromePhp::log('MeteringChannel');
                                    //ChromePhp::log($MeteringChannel);
                                    if (isset($MeteringChannel->settlementIndicator) && ($MeteringChannel->settlementIndicator == 'true')) {
                                        //ChromePhp::log('settlement true');
                                        $pricingObject = new PricingTable;

                                        // ChromePhp::log($icpDetails->icpDetails_v1Result->myPricingHistory->allPriceCategoryCodes->PriceCategoryCode[0]->code);
                                        $GXPData = array(
                                                'RegisterContent' => $MeteringChannel->vRegisterContentCode . $MeteringChannel->periodOfAvailability,
                                                'Network' => $icpDetails->icpDetails_v1Result->myNetworkHistory->myNetwork->code,
                                                'PriceCode:PartialMatch' => $icpDetails->icpDetails_v1Result->myPricingHistory->allPriceCategoryCodes->PriceCategoryCode[0]->code,
                                                'GXP:PartialMatch' => $icpDetails->icpDetails_v1Result->myNetworkHistory->bus

                                        );


                                        //ChromePhp::log('$GXPData');
                                        //ChromePhp::log($GXPData);
                                        $PDFs = $pricingObject->get()->filter($GXPData);

                                        foreach ($PDFs as $PDF) {
                                            $registerContentObject = new RegisterContent;
                                            $RegContentData = array(
                                                    'RegContentCode' => $MeteringChannel->vRegisterContentCode . $MeteringChannel->periodOfAvailability
                                            );
                                            $RegisterContents = $registerContentObject->get()->filter($RegContentData)->First();
                                            // fb($RegisterContents);
                                            $PDFName = $PDF->PDFPrefix;
                                            //ChromePhp::log($PDF->PDFPrefix);
                                            // ChromePhp::log($PDF->RegisterMap);
                                            switch ($PDF->RegisterMap) {
                                                case 'I':
                                                    $PDFName .= "I";
                                                    break;
                                                case 'B':
                                                    $PDFName .= "B";
                                                    break;
                                                case 'D':
                                                    $PDFName .= "DT";
                                                    break;
                                                case 'N':
                                                    $PDFName .= "UN";
                                                    break;
                                                case 'T':
                                                    $PDFName .= "DT";
                                                    break;
                                                case 'U':
                                                    $PDFName .= "UN";
                                                    break;
                                                case 'E':
                                                    $PDFName .= "I";
                                                    break;
                                                case 'C':
                                                    $PDFName .= "C";
                                                    break;
                                            }
                                            ChromePhp::log($PDFName);
                                            $billingType = array($MeteringChannel->vRegisterContentCode . $MeteringChannel->periodOfAvailability, $MeteringChannel->settlementIndicator, $PDFName, $RegisterContents->RegContentDesc, $MeteringChannel->vMeteringComponentSerialNumber);
                                            array_push($meterDetailArray, $billingType);


                                        }
                                        //ChromePhp::log($PDFs);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                $regMeters = false;
            }
            // ChromePhp::log($meterDetailArray);
            //remove duplicates from multidimensional array see http://stackoverflow.com/questions/307674/how-to-remove-duplicate-values-from-a-multi-dimensional-array-in-php
            // no good: $meterDetailArray = array_map("unserialize", array_unique(array_map("serialize", $meterDetailArray)));
            // no longer used $meterDetailArray = array_values(array_intersect_key( $meterDetailArray , array_unique( array_map('serialize' , $meterDetailArray ) ) ));
            // ChromePhp::log('no longer filtered array see line 859 Signup.php');
            // ChromePhp::log($meterDetailArray);
            if ($regMeters == true) {
                array_push($results['address'], $icpDetails->icpDetails_v1Result->myAddressHistory);
                array_push($results['result'], $icpDetails->icpDetails_v1Result->myNetworkHistory->myNetwork->code);
                $results['smartMeter'] = $icpDetails->icpDetails_v1Result->myMeteringHistory->amiFlag;
                //$results['all'] = $icpDetails;
                $results['meterDetailArray'] = $meterDetailArray;
            }
            else {
                array_push($results['address'], null);
                array_push($results['result'], null);
                $results['smartMeter'] = null;
                //$results['all'] = $icpDetails;
                $results['meterDetailArray'] = null;

            }
        }
        //ChromePhp::log('getnetworkprovider results');
        //ChromePhp::log($results);
        print $result_st = Convert::array2json($results);
    }

    function getSchool() {
        $request = $this->getRequest();
//      ChromePhp::log($request);
//
        $decrequest = json_decode($request->getVar("name_startsWith"), true);
        $decrequest = $request->getVar("name_startsWith");
        //ChromePhp::log($decrequest);
//        // results array initialisation

        $results = DataList::create('School')->filter(array('SchoolName:StartsWith' => $decrequest));
        // print_r($results);
        //ChromePhp::log($results);
        $schoolArray = array();
        foreach ($results as $result) {
            // ChromePhp::log($result->SchoolName);
            if ($result->SchoolLevel == 'Contributing') $level = "(Primary)";
            else $level = "(" . $result->SchoolLevel . ")";
            $schoolArray['schools'][] = (object)array('SchoolName' => $result->SchoolName . ' ' . $level);
        }
//ChromePhp::log($schoolArray);
//
        //ChromePhp::log("here");
        //print $result_st='[{value:"Takapuna Grammar School"},{value:"Takapuna Normal Intermediate"},{value:"Takapuna School"}]';
        print $result_st = Convert::array2json($schoolArray);
        //ChromePhp::log($result_st);
    }


    /**
     * Generate the javascript for the conditional field show / hiding logic.
     *
     * @return void
     */
    public function generateConditionalJavascript() {
        $default = "";
        $rules = "";

        $watch = array();
        $watchLoad = array();

        if ($this->Fields()) {
            foreach ($this->Fields() as $field) {
                $fieldId = $field->Name;

                $fieldId = Convert::raw2att(str_replace(' ', '', ucwords('Application_' . $field->Title)));


                if ($field->ClassName == 'EditableFormHeading') {
                    $fieldId = 'Form_Form_' . $field->Name;
                }

                // Is this Field Show by Default
                if (!$field->getShowOnLoad()) {
                    $default .= "$(\"#" . $fieldId . "\").hide();\n";
                }

                // Check for field dependencies / default
                if ($field->Dependencies()) {
                    foreach ($field->Dependencies() as $dependency) {

                        if (is_array($dependency) && isset($dependency['ConditionField']) && $dependency['ConditionField'] != "") {
                            // get the field which is effected
                            $formName = Convert::raw2sql($dependency['ConditionField']);
                            $formFieldWatch = DataObject::get_one("EditableFormField", "\"Name\" = '$formName'");

                            if (!$formFieldWatch) break;

                            // watch out for multiselect options - radios and check boxes
                            if (is_a($formFieldWatch, 'EditableDropdown')) {
                                $fieldToWatch = "$(\"select[name='" . $fieldId . "']\")";
                                $fieldToWatchOnLoad = $fieldToWatch;
                            }
                            // watch out for checkboxs as the inputs don't have values but are 'checked
                            else if (is_a($formFieldWatch, 'EditableCheckboxGroupField')) {
                                $fieldToWatch = "$(\"input[name='" . $fieldId . "[" . $dependency['Value'] . "]']\")";
                                $fieldToWatchOnLoad = $fieldToWatch;
                            }
                            else if (is_a($formFieldWatch, 'EditableRadioField')) {
                                $fieldToWatch = "$(\"input[name='" . $fieldId . "']\")";
                                // We only want to trigger on load once for the radio group - hence we focus on the first option only.
                                $fieldToWatchOnLoad = "$(\"input[name='" . $fieldId . "']:first\")";
                            }
                            else {
                                $fieldToWatch = "$(\"input[name='" . $fieldId . "']\")";
                                $fieldToWatchOnLoad = $fieldToWatch;
                            }

                            // show or hide?
                            $view = (isset($dependency['Display']) && $dependency['Display'] == "Hide") ? "hide" : "show";
                            $opposite = ($view == "show") ? "hide" : "show";

                            // what action do we need to keep track of. Something nicer here maybe?
                            // @todo encapulsation
                            $action = "change";

                            if ($formFieldWatch->ClassName == "EditableTextField") {
                                $action = "keyup";
                            }

                            // is this field a special option field
                            $checkboxField = false;
                            $radioField = false;
                            if (in_array($formFieldWatch->ClassName, array('EditableCheckboxGroupField', 'EditableCheckbox'))) {
                                $action = "click";
                                $checkboxField = true;
                            }
                            else if ($formFieldWatch->ClassName == "EditableRadioField") {
                                $radioField = true;
                            }

                            // Escape the values.
                            $dependency['Value'] = str_replace('"', '\"', $dependency['Value']);

                            // and what should we evaluate
                            switch ($dependency['ConditionOption']) {
                                case 'IsNotBlank':
                                    $expression = ($checkboxField || $radioField) ? '$(this).attr("checked")' : '$(this).val() != ""';

                                    break;
                                case 'IsBlank':
                                    $expression = ($checkboxField || $radioField) ? '!($(this).attr("checked"))' : '$(this).val() == ""';

                                    break;
                                case 'HasValue':
                                    if ($checkboxField) {
                                        $expression = '$(this).attr("checked")';
                                    }
                                    else if ($radioField) {
                                        // We cannot simply get the value of the radio group, we need to find the checked option first.
                                        $expression = '$(this).parents(".field").find("input:checked").val()=="' . $dependency['Value'] . '"';
                                    }
                                    else {
                                        $expression = '$(this).val() == "' . $dependency['Value'] . '"';
                                    }

                                    break;
                                case 'ValueLessThan':
                                    $expression = '$(this).val() < parseFloat("' . $dependency['Value'] . '")';

                                    break;
                                case 'ValueLessThanEqual':
                                    $expression = '$(this).val() <= parseFloat("' . $dependency['Value'] . '")';

                                    break;
                                case 'ValueGreaterThan':
                                    $expression = '$(this).val() > parseFloat("' . $dependency['Value'] . '")';

                                    break;
                                case 'ValueGreaterThanEqual':
                                    $expression = '$(this).val() >= parseFloat("' . $dependency['Value'] . '")';

                                    break;
                                default: // ==HasNotValue
                                    if ($checkboxField) {
                                        $expression = '!$(this).attr("checked")';
                                    }
                                    else if ($radioField) {
                                        // We cannot simply get the value of the radio group, we need to find the checked option first.
                                        $expression = '$(this).parents(".field").find("input:checked").val()!="' . $dependency['Value'] . '"';
                                    }
                                    else {
                                        $expression = '$(this).val() != "' . $dependency['Value'] . '"';
                                    }

                                    break;
                            }

                            if (!isset($watch[$fieldToWatch])) {
                                $watch[$fieldToWatch] = array();
                            }

                            $watch[$fieldToWatch][] = array(
                                    'expression' => $expression,
                                    'field_id' => $fieldId,
                                    'view' => $view,
                                    'opposite' => $opposite
                            );

                            $watchLoad[$fieldToWatchOnLoad] = true;

                        }
                    }
                }
            }
        }

        if ($watch) {
            foreach ($watch as $key => $values) {
                $logic = array();

                foreach ($values as $rule) {
                    // Register conditional behaviour with an element, so it can be triggered from many places.
                    $logic[] = sprintf(
                            'if(%s) { $("#%s").%s(); } else { $("#%2$s").%s(); }',
                            $rule['expression'],
                            $rule['field_id'],
                            $rule['view'],
                            $rule['opposite']
                    );
                }

                $logic = implode("\n", $logic);
                $rules .= $key . ".each(function() {\n
   	$(this).data('userformConditions', function() {\n
   		$logic\n
   	}); \n
   });\n";

                $rules .= $key . ".$action(function() {
   	$(this).data('userformConditions').call(this);\n
   });\n";
            }
        }

        if ($watchLoad) {
            foreach ($watchLoad as $key => $value) {
                $rules .= $key . ".each(function() {
   	$(this).data('userformConditions').call(this);\n
   });\n";
            }
        }

        // Only add customScript if $default or $rules is defined
        if ($default || $rules) {
            Requirements::customScript(<<<JS
   				(function($) {
   					$(document).ready(function() {
   						$default

   						$rules
   					})
   				})(jQuery);
JS
                    , 'UserFormsConditional');
        }
    }


// ========================================= API Calls Ends ================================================================

// ========================================= Private Functions Start ================================================================


    /*
     * Generates a unique name for a fields in the fieldlist provided. Checks if the proposed name exists,
     * calls the function recursivly
     *
     * @param   String      $field_name The proposed name, checks if this exists.
     * @param   FieldList   $fields The fields list to add to
     */
    private function setField_Name($field_name, $fieldslist, $postfix = 2) {
        if ($fieldslist->dataFieldByName($field_name)) {
            $field_name = $field_name . $postfix;
            $name = $this->setField_Name($field_name, $fieldslist, $postfix++);
        }
        else {
            $name = $field_name;
        }
        return $name;
    }

// this is because PHPs empty function does not work properly except on true empty array()
    private function is_array_empty($a) {
        if (empty($a)) return true;
        foreach ($a as $elm)
            if (!empty($elm)) return false;
        return true;
    }

    /*
     * Generates the tags for all the advoptionset fields in the fieldlist provided so that
     * it can be controlled from the CMS. Just go to the Form Data menu -> Tags tab
     *
     * @param   FieldList  $fieldslist The fields list look into
     */
    private function generateTags($fieldslist) {
        $fields = $fieldslist->dataFields();

        foreach ($fields as $field) {
            if ($field->Type() == 'advoptionset') {
                $num_of_opts = count($field->source);

                for ($i = 1; $i <= $num_of_opts; $i++) {
                    $tag1_name = TagsText::_tPlain(substr($field->Title(), 0, 20) . '- option ' . $i . ' Tag 1', '', 'Tag Text - color:Blue');
                    $tag2_name = TagsText::_tPlain(substr($field->Title(), 0, 20) . '- option ' . $i . ' Tag 2', '', 'Tag Text - color:GreyGreen');
                    $field->add_tag($i, array(
                            'Value' => $tag1_name,
                            'CSSClass' => ($tag1_name) ? 'blue' : '',
                    ));

                    $field->add_tag($i, array(
                            'Value' => $tag2_name,
                            'CSSClass' => ($tag2_name) ? 'green' : '',
                    ));
                }

            }
        }
    }


    /*
     * Generates the day,month,year dropdown fields and add them to a Fieldlist
     *
     * @param   String      $ID The id of the original DateField, used to generate unique IDs for the fields
     * @param   FieldList   $fields The fields list to add to
     */
    private
    function generate_dd($ID, $fields) {
        $month_array = array();
        $day_array = array();
        $year_array = array();

        for ($mnth = 1; $mnth <= 12; $mnth++) {
            $month_array[$mnth] = $mnth;
        }
        for ($day = 1; $day <= 31; $day++) {
            $day_array[$day] = $day;
        }
        for ($year = date("Y"); $year >= 1900; $year--) {
            $year_array[$year] = $year;
        }

        $day_dd = DropdownField::create('Application_' . $ID . '_Day', '', $day_array)
                ->setRightTitle('input60')
                ->setEmptyString('DD')
              //  ->setAttribute('required','required')
                ->setFieldHolderTemplate("ApplicationFormField_holder");

        $mnth_dd = DropdownField::create('Application_' . $ID . '_Month', '', $month_array)
                ->setEmptyString('MM')
              //  ->setAttribute('required','required')
                ->setRightTitle('input60')
                ->setFieldHolderTemplate("ApplicationFormField_holder");

        $yr_dd = DropdownField::create('Application_' . $ID . '_Year', '', $year_array)
                ->setEmptyString('YYYY')
             //   ->setAttribute('required','required')
                ->setRightTitle('input80')
                ->setFieldHolderTemplate("ApplicationFormField_holder");

        $fields->push($day_dd);
        $fields->push($mnth_dd);
        $fields->push($yr_dd);

    }

}