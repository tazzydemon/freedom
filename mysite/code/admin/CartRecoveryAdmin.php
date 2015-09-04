<?php
class CartRecoveryAdmin extends ModelAdmin {
	public static $managed_models = array(
		'CartRecovery',

	);

    static $model_importers = array(

    );

    public function getExportFields() {
        return array(
                'ID'=> 'ID',
                'LastEdited'=> 'Last Edited',
                'CustomerName' => 'Customer Name',
                'CustomerContactNumber' => 'Contact Number',
                'EmailSent'=> 'Email Sent',
                'CartComplete'=> 'Cart Complete'
        );
    }
//following help from gist https://gist.github.com/dljoseph/de44dce46b2194661381
    public function getSearchContext() {
        $context = parent::getSearchContext();
        $dateField = new DateField("q[FromDate]", "From Date");
        // Get the DateField portion of the DatetimeField and
        // Explicitly set the desired date format and show a date picker
        $dateField->setConfig('dateformat', 'dd/MM/yyyy')->setConfig('showcalendar', true);
        $context->getFields()->push($dateField);
        $dateField = new DateField("q[ToDate]", "To Date");
        // Get the DateField portion of the DatetimeField and
        // Explicitly set the desired date format and show a date picker
        $dateField->setConfig('dateformat', 'dd/MM/yyyy')->setConfig('showcalendar', true);
        $context->getFields()->push($dateField);
        return $context;
    }
    public function getList() {
        $list = parent::getList();
        $params = $this->request->requestVar('q'); // use this to access search parameters
        if(isset($params['FromDate']) && $params['FromDate']) {
            $list = $list->exclude('LastEdited:LessThan', $params['FromDate']);
        }
        if(isset($params['ToDate']) && $params['ToDate']) {
            //split UK date into day month year variables
            list($day,$month,$year) = sscanf($params['ToDate'], "%d/%d/%d");
            //date functions expect US date format, create new date object
            $date = new Datetime("$month/$day/$year");
            //create interval of Plus 1 Day (P1D)
            $interval = new DateInterval('P1D');
            //add interval to the date
            $date->add($interval);
            //use the new date value as the GreaterThan exclusion filter
            $list = $list->filter('LastEdited:LessThanOrEqual', date_format($date, 'd/m/Y'));
        }
        return $list;
    }



	static $url_segment = 'cartrecovery';
	static $menu_title = 'Cart Recovery';


}