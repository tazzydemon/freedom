<?php
class SignUpSubmission extends DataObject {
	static $db = array(
		'CustomerName' => 'Varchar',
		'Address' => 'Varchar',
                'HasPromotionCode' => 'Varchar',
                'PromotionCode' => 'Varchar',
                'ICPNumber' => 'Varchar',
                'ICPNumberMatch' => 'Varchar',
                'NetworkProvider' => 'Varchar',
                'BillSize' => 'Varchar',
                'MonthBillReceived' => 'Varchar',
                'PricePlan' => 'Varchar',
		'PulseSchool' => 'Varchar',
		'School' => 'Varchar',
                'SchoolName' => 'Varchar',
            	'SchoolLevel' => 'Varchar',
                'ElectronicServices' => 'Varchar',
                'SmoothPay' => 'Varchar',
                'SmoothPayFrequency' => 'Varchar',
                'Cancellation_Reason' => 'Varchar',
                'CustomerPhoneNumber' => 'Varchar',
                'BestTimeToContact' => 'Varchar',
		'FormData' => 'Text'
	);
	
	static $field_labels = array(
		'Created' => 'Date Submitted',
		'Address' => 'Location',
		'BillSize' => 'Monthly Bill Payment',
		'PricePlan' => 'Price Plan',
		'CustomerName' => 'Customer Name',
		'Address' => 'Address',
                'HasPromotionCode' => 'Has Promotion Code?',
                'PromotionCode' => 'Promotion Code',
                'ICPNumber' => 'ICP Number',
                'ICPNumberMatch' => 'ICP Match?',
                'NetworkProvider' => 'Network Provider',
                'BillSize' => 'Average Bill Size',
                'MonthBillReceived' => 'Month bill recieved',
		'PulseSchool' => 'Pulse School Programme',
                'SchoolName' => 'School Name - not on the list',
		'FormData' => 'Application form data'
	);
	static $summary_fields = array(
        'ID',
		'Created',
		'Address',
		'BillSize',
		'PricePlan',
        'Cancellation_Reason'
	);
	static $searchable_fields = array(
		'Created',
		'Address'
	);

    static $default_sort = "ID DESC";
        
        function getCMSFields() {
            $fields = parent::getCMSFields();
            //Hide School ID, Only editable by CMS
            //$fields->removeByName('SchoolID');
            
            return $fields;
        }
        
        function onBeforeWrite() {
            parent::onBeforeWrite();
            
            if($this->SchoolName && !$this->ID){
                $school = School::get()->filter(array('SchoolName' => $this->SchoolName))->First();
                if(count($school)> 0){
                    $this->SchoolID = $school->ID;
                }else{
                    $new_school = School::create();
                    $new_school->SchoolName = $this->SchoolName;
                    $new_school->SchoolLevel = $this->SchoolLevel;
                    $new_school->write();
                    
                    $this->SchoolID = $new_school->ID;
                }
            }
            
            if($this->ID){
                $form_data = array();
                $all_fields_array = Convert::json2array($this->FormData);
                
                foreach($all_fields_array as $key => $value){
                    
                    $form_data[$key] = $this->$key;
                    
                }
                $this->FormData = Convert::array2json($form_data);
            }
        }
	
}
