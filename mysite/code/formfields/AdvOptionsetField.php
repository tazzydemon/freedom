<?php
class AdvOptionsetField extends OptionsetField {
	//Array of strings, each string represents a Tag.
	protected $tags = array();

    protected $showTitle = true;


	public function Field($properties = array()) {
		$source = $this->getSource();
		$odd = 0;
		$index = 1;
		$options = array();

		if($source) {
			foreach($source as $value => $title) {
                            $bft = '';
                            if(is_array($title)){
                                $bft = $title[1];
                                $title = $title[0];
                                
                            }
				$itemID = $this->ID() . '_' . preg_replace('/[^a-zA-Z0-9]/', '', $value);
				$odd = ($odd + 1) % 2;
				$extraClass = $odd ? 'odd' : 'even';
				$extraClass .= ' val' . preg_replace('/[^a-zA-Z0-9\-\_]/', '_', $value);
				$options[] = new ArrayData(array(
					'ID' => $itemID,
					'Class' => $extraClass,
					'Name' => $this->name,
					'Value' => $value,
					'Title' => $title,
					'isChecked' => $value == $this->value,
					'isDisabled' => $this->disabled || in_array($value, $this->disabledItems),
                                        //Added for custom effects.
                                        'Tags' => $this->getOptionTags($index++),
                                        'Benefit' => $bft,
                                        'ShowTitle'=> $this->showTitle,
                                        //Added for cms effects
                                        'RadioLabel'        => $value.": First Label",
                                        'RadioLabelUsage'   => "Label for answer option ".$value."under".$title,
                                        'Row2'              => $value.": Second Label",
                                        'Row3'              => $value.": Third Label",
                                        'Note'              => $value."'s Note",
                                        'Note1'             => $value."'s Note1"

				));
			}
		}

		$properties = array_merge($properties, array(
			'Options' => new ArrayList($options)
		));

		return $this->customise($properties)->renderWith(
			$this->getTemplates()
		);
	}

	/*
	 * Adds a tag to an option in the optionSet
         * @param Array $tag is an array where first has key 'Value' and this holds the value of the Tag and the second has key 'CSSClass' this holds the cssclass to add.
         * 
	 */
	public function add_tag($option_num, $tag){
		$tags =& $this->tags;

		if(isset($tags[$option_num]))
			array_push($tags[$option_num],$tag);
		else
			$tags[$option_num] = array($tag);
	}

	/*
	 * Removes a tag for an option in the optionSet
	 */
	public function remove_tag($option_num, $tag){
		$ar =& $this->tags;
		if(isset($ar[$option_num])){
			unset($ar[$option_num][$tag]);
		}
	}

	/*
	 * Returns the tags linked to the option number = option_num
	 * @return ArrayList|Null
	 */
	public function getOptionTags($option_num){
		$tags = $this->tags;

		if(isset($tags[$option_num])){
			$All_tags = new ArrayList(array());
			foreach($tags[$option_num] as $tag){
				$result = new ArrayData(array(
					'Tag' => $tag
				));
				$All_tags->add($result);
			}
			return $All_tags;
		}
		else{
			return null;
		}
	}

	public function setTags($tags){
		$this->tags = $tags;
	}

	public function getTags(){
		return $this->tags;
	}

    public function setShowTitle($showTitleVal){
        $this->showTitle = $showTitleVal;
    }

    public function getShowTitle(){
        return $this->showTitle;
    }
}
