<?php
/**
 * Allows an editor to insert a generic heading into a field
 *
 * @package userforms
 */

class EditableSectionField extends EditableFormField {

	private static $singular_name = 'Section Field';
	
	private static $plural_name = 'Section Fields';
	
	public function getFieldConfiguration() {
		$options = parent::getFieldConfiguration();
                
                $description = ($this->getSetting('Description')) ? $this->getSetting('Description') : '';
                $options->push(
			new TextField(
				$this->getSettingName('Description'), 
				_t('EditableSectionField.DESCRIPTION', 'Description'),
                                $description
			)
		);
		return $options;
	}

	public function getFormField() {
		$labelField = HeaderField::create($this->Name,$this->Title,3)
                    ->setDescription($this->getSetting('Description'))
                    ->setTemplate('Application_SectionField');
		return $labelField;
	}
	
	public function getFieldValidationOptions() {
		return false;
	}
        
        public function getIcon() {
		return SSViewer::get_theme_folder().'/images/formIcons/' . strtolower($this->class) . '.png';
	}
}
