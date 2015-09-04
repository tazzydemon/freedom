<div class="section FormHeading openSection">
    <div class="block">
        <h2 id="Form_SignUpForm_EditableFormHeading11">$_plainTextSummary("Heading","Hi") <span data-bind="text: userName"></span>,</h2>
        <br/>
        <h4 id="Form_SignUpForm_EditableFormHeading12">$_plainTextSummary("Subheading1","Here is a summary of the benefits you will receive on your Freedom Plan.","Line1")</h4>
        <h4 id="Form_SignUpForm_EditableFormHeading18">$_plainTextSummary("Subheading2","You can change any of the options you have chosen today once you are a Pulse Energy customer","Line2")</h4>

    </div>
    <hr>
    <hr>
</div>

<div class="section featuresTable openSection">

    <!-- SEARCH FOR A SCHOOL -->
    <div class="summaryBlock">

       <%--  <h3 class=" FormHeading " id="Form_SignUpForm_EditableFormHeading7">$_plainTextSummary("School section heading","Search for School")</h3> --%>

        <div class="summaryHeader">
            <div>$_plainTextSummary("School Section Feature","Feature")</div>
            <div>$_plainTextSummary("School Section Benefit","Details")</div>
        </div>

        <%-- <div class="hoverRow">
            <div class="field readonly text right" id="EditableTextField12">
                <label class="left">Suburb</label>
                <div class="middleColumn">
                    <span class="readonly text right" id="Form_SignUpForm_EditableTextField12"  data-bind="text: summarySuburb">
                    </span>
                </div>
            </div>

            <div class="field readonly text " id="EditableTextField13">
                <label class="left">Power usage each year</label>
                <div class="middleColumn">
                    <span class="readonly text " id="Form_SignUpForm_EditableTextField13" data-bind="text: benefitSuburb">
                            Allows for accurate pricing
                    </span>
                </div>
            </div>
            <a href="#" class="textLink">$_plainTextSummary("Edit Text","Edit")</a>
        </div> --%>
        <!-- end hoverRow -->

        <div class="hoverRow odd" id="application_summary_line1">
                <div class="field readonly text right">
                    <div class="middleColumn">
                        <span class="readonly text right">
                            Pulse Promotion Code
                        </span>
                    </div>
                </div>

                <div class="field readonly text" >
                    <div class="middleColumn">
                            <span class="readonly text" data-bind="text: promotionCodeSummary">
                                No
                            </span>
                    </div>
                </div>

                <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_PulsePromotionCode,section'>$_plainTextSummary("Edit Text","Change")</a>
        </div><!-- end hoverRow -->

        <div class="hoverRow even" id="application_summary_line2">
                <div class="field readonly text right">
                    <div class="middleColumn">
                        <span class="readonly text right">
                            Your Address
                        </span>
                    </div>
                </div>

                <div class="field readonly text" >
                    <div class="middleColumn">
                            <span class="readonly text"  data-bind="text: userSuburb">
                                12 Symonds Street, 1010, Auckland
                            </span>
                    </div>
                </div>

                <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_Suburb'>$_plainTextSummary("Edit Text","Change")</a>
        </div><!-- end hoverRow -->

        <div class="hoverRow odd" id="application_summary_line3">
                <div class="field readonly text right">
                    <div class="middleColumn">
                        <span class="readonly text right">
                            Your ICP
                        </span>
                    </div>
                </div>

                <div class="field readonly text" >
                    <div class="middleColumn">
                            <span class="readonly text icp-summary">
                                {ICP Number}
                            </span>
                    </div>
                </div>

                <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_CustomerICPNumber,section'>$_plainTextSummary("Edit Text","Change")</a>
        </div><!-- end hoverRow -->

<%--    <div class="hoverRow even" id="application_summary_line4a">
            <div class="field readonly text right">
                <div class="middleColumn">
                    <span class="readonly text right">
                        Residential Home
                    </span>
                </div>
            </div>

            <div class="field readonly text">
                <div class="middleColumn">
                        <span data-bind="text: primaryResidenceDeclaration" class="readonly text">

                        </span>
                </div>
            </div>

            <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_PrimaryResidenceDeclaration,section'>$_plainTextSummary("Edit Text","Change")</a>
    </div><!-- end hoverRow -->--%>


        <div class="hoverRow even" id="application_summary_line4">
                <div class="field readonly text right">
                    <div class="middleColumn">
                        <span class="readonly text right">
                            User Type
                        </span>
                    </div>
                </div>

                <div class="field readonly text">
                    <div class="middleColumn">
                            <span data-bind="text: userTypeSummary" class="readonly text usertype-summary">
                                Standard User
                            </span>
                    </div>
                </div>

                <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_BillSize,section'>$_plainTextSummary("Edit Text","Change")</a>
        </div><!-- end hoverRow -->

         <!-- Your Price -->

        <div class="hoverRow odd" id="application_summary_line5">
            <div class="field readonly text ">
                <div class="middleColumn">
                   <span class="readonly text " >
                      Price Plan
                   </span>
                </div>
            </div>


            <div class="field readonly text ">
                <div class="middleColumn">
                    <span data-bind="text: pricePlan" class="readonly text">
                    </span>
                </div>
            </div>

            <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_PricePlan'>$_plainTextSummary("Edit Text","Change")</a>

        </div>
         

        <div class="hoverRow even"  id="application_summary_line6">

            <div class="field readonly text ">
                <div class="middleColumn">
                   <span class="readonly text" id="Form_SignUpForm_EditableTextField14a">
                    Your Lines Company
                   </span>
                </div>
            </div>


            <div class="field readonly text ">
                <div class="middleColumn">
                    <span class="readonly text network-summary">
                        
                    </span>
                </div>
            </div>

            <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_Suburb'>$_plainTextSummary("Edit Text","Change")</a>

        </div>

        <div class="hoverRow odd"  id="application_summary_line7">
            <div class="field readonly text">
                <div class="middleColumn">
                    <span class="readonly text ">
                        Price Protection
                    </span>
                </div>
            </div>


            <div class="field readonly text ">
                <div class="middleColumn">
                   <span class="readonly text" >
                    Your Energy Rate will be protected free of charge for a minimum of 3 years.
                  </span>
                </div>
           </div>
        </div>


<!-- Payment Options -->


        <div class="hoverRow even" id="application_summary_line8">
            <div class="field readonly text ">
                <div class="middleColumn">
                    <span class="readonly text">
                        Direct Debit Discount
                    </span>
                </div>
            </div>



            <div class="field readonly text " >
                <div class="middleColumn">

                   <span class="readonly text " data-bind="text: summaryDirectDebitDiscount">
                  </span>
                </div>
            </div>
            <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_ElectronicServices'>$_plainTextSummary("Edit Text","Change")</a>
        </div>

        <div class="hoverRow odd" id="application_summary_line9">
            <div class="field readonly text ">
                <div class="middleColumn">
                   <span class="readonly text " >
                    Online Discount
                  </span>
                </div>
            </div>

            <div class="field readonly text ">
                <div class="middleColumn">
                   <span class="readonly text " data-bind="text:summaryOnlineDiscount">
                  </span>
                </div>
            </div>

            <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_ElectronicServices'>$_plainTextSummary("Edit Text","Change","This changes the Edit box text for ALL options that have it")</a>

        </div>

        <div class="hoverRow even" id="application_summary_line10">
            <div class="field readonly text ">
                <div class="middleColumn">
                   <span class="readonly text ">
                    SmoothPay
                  </span>
                </div>
            </div>

            <div class="field readonly text ">
                <div class="middleColumn">
                  <!-- <span  data-bind="text: smoothPay" class="readonly text ">
                       Yes-->
                    <span class="readonly text" id="Form_SignUpForm_EditableTextField21a"  data-bind="text: summarySmoothPay">
                  </span>
                </div>
            </div>
            <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_SmoothPay'>$_plainTextSummary("Edit Text","Change")</a>
        </div>

        <div class="hoverRow odd" id="application_summary_line11">
            <div class="field readonly text ">
                <div class="middleColumn">
                   <span class="readonly text ">
                    SmoothPay Frequency
                  </span>
                </div>
            </div>

            <div class="field readonly text ">
                <div class="middleColumn">
                   <span data-bind="text: smoothPayFrequencySummary" class="readonly text ">
                  </span>
                </div>
            </div>
            <a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_SmoothPayFrequency'>$_plainTextSummary("Decide Now","Decide Now")</a>
        </div>


        <%--<div class="hoverRow even" id="application_summary_line12">--%>

            <%--<div class="field readonly text ">--%>
                <%--<div class="middleColumn">--%>

                    <%--<span class="readonly text ">--%>
                        <%--Cool for School Programme--%>
                    <%--</span>--%>
                <%--</div>--%>
            <%--</div>--%>

            <%--<div class="field readonly text ">--%>
                <%--<div class="middleColumn">--%>
                    <%--<span data-bind="text: summaryChooseSchool" class="readonly text" id="Form_SignUpForm_EditableTextField20a"  data-bind="text: summaryChooseSchool">--%>
                    <%--</span>--%>
                <%--</div>--%>
            <%--</div>--%>

<%--<!--            <a href="#" class="textLink"  onclick="generate_Dialog('Form_SignUpForm_PulseSchool','section')">$_plainTextSummary("Edit Text","Edit")</a>-->--%>
            <%--<a href="#" class="btn btnMedSummary blue textLink dialogBox"  dialog_id='Form_SignUpForm_PulseSchool,section'>$_plainTextSummary("Edit Text","Change")</a>--%>

        <%--</div>--%>
    </div>
    <hr>
    <hr>
</div>
<!-- END SUMMARY -->