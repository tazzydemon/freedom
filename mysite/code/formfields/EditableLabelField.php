<?php
/**
 * Allows an editor to insert a generic heading into a field
 *
 * @package userforms
 */

class EditableLabelField extends EditableFormField {

	private static $singular_name = 'Label Field';
	
	private static $plural_name = 'Label Fields';
	
	public function getFieldConfiguration() {
		$options = parent::getFieldConfiguration();
		return $options;
	}

	public function getFormField() {
		$labelField = new LabelField($this->Name,$this->Title);
		$labelField->addExtraClass('label');
		
		return $labelField;
	}
	
	public function getFieldValidationOptions() {
		return false;
	}
        
        public function getIcon() {
		return SSViewer::get_theme_folder().'/images/formIcons/' . strtolower($this->class) . '.png';
	}
}
