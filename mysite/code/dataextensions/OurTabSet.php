<?php
/**
 * Extending the default TabSet to override the function that calls jquery-ui css as we need our own.
 * Implemented by nathan@infinity.io
 * Idea by Nik@infinty.io
 */
class OurTabSet extends TabSet {
	

	
	/**
	 * Returns a tab-strip and the associated tabs.
	 * The HTML is a standardised format, containing a &lt;ul;
	 */
	public function FieldHolder($properties = array()) {
//        print_r($this->ThemeDir());
//        print_r('<br>');
//        print_r(THEMES_DIR);
//        print_r('<br>');
//        print_r(SSViewer::current_custom_theme());
        //Requirements::javascript($this->ThemeDir(). '/js/thirdparty/one.js');
		Requirements::javascript($this->ThemeDir().  '/js/thirdparty/jquery1.10.1.min.js');
		Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery-ui/jquery-ui.js');
		Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery-cookie/jquery.cookie.js');

        //This should be all that's needs
		//Requirements::css(FRAMEWORK_DIR . '/thirdparty/jquery-ui-themes/smoothness/jquery-ui.css');

		Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery-entwine/dist/jquery.entwine-dist.js');

		Requirements::javascript(FRAMEWORK_DIR . '/javascript/TabSet.js');
		
		$obj = $properties ? $this->customise($properties) : $this;
		
		return $obj->renderWith($this->getTemplates());
	}

}
