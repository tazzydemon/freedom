<?php

/**
 * Editable Literal Field. A literal field is just a blank slate where
 * you can add your own HTML / Images / Flash
 * 
 * @package userforms
 */

class EditableHTMLField extends EditableFormField {
	
	private static $singular_name = 'Div Block';
	
	private static $plural_name = 'Div Blocks';
	
	public function getFieldConfiguration() {
		$customSettings = unserialize($this->CustomSettings);	
		$content = (isset($customSettings['Content'])) ? $customSettings['Content'] : '';
		$textAreaField = new TextareaField(
			$this->getSettingName('Content'),
			"HTML",
			$content
		);
		$textAreaField->setRows(4);
		$textAreaField->setColumns(20);
				
		return new FieldList(
			$textAreaField,
			new CheckboxField(
				$this->getSettingName('HideFromReports'),
				_t('EditableLiteralField.HIDEFROMREPORT', 'Hide from reports?'), 
				$this->getSetting('HideFromReports')
			)
		);
	}

	public function getFormField() {
		return new LiteralField("LiteralField[$this->ID]", $this->getSetting('Content'));
	}
	
	public function showInReports() {
		return (!$this->getSetting('HideFromReports'));
	}
        public function getIcon() {
		return SSViewer::get_theme_folder().'/images/formIcons/editableliteralfield.png';
	}
}
