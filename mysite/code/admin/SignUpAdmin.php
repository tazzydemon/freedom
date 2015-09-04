<?php
class SignUpAdmin extends ModelAdmin {
	public static $managed_models = array(
		'SignUpSubmission',
        'School',
        'RegisterContent'
	);
    static $model_importers = array(
     'School' => 'CsvBulkLoader',
     'RegisterContent' => 'CsvBulkLoader',
    );

	static $url_segment = 'signups';
	static $menu_title = 'Sign ups list';
        
        public function getList() {
        $list = parent::getList();
        $params = $this->request->requestVar('q'); // use this to access search parameters
        if($this->modelClass == 'School') {
            $list->exclude('SchoolStatus', 'Approved');
        }
        return $list;
    }
	
}