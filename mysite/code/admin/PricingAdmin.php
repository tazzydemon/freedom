<?php
class PricingAdmin extends ModelAdmin {
	public static $managed_models = array(
        'PricingTable',
        'RegisterContent'
	);
    static $model_importers = array(

     'PricingTable' => 'CsvBulkLoader',
     'RegisterContent' => 'CsvBulkLoader',
    );

	static $url_segment = 'pricing';
	static $menu_title = 'Pricing Admin';

}