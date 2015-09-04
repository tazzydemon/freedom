<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of School
 *
 * @author Amir
 */
class RegisterContent extends DataObject{
    static $db = array(
        'RegContentCode' => 'Varchar',
        'RegContentDesc' => 'Varchar',
        'RegContentRegisterCode' => 'Varchar',
        'RegContentRestAvail' => 'Varchar',
    );
    
    static $searchable_fields = array(
            'RegContentCode',
            'RegContentDesc',
            'RegContentRegisterCode',
            'RegContentRestAvail',
    );
    static $summary_fields = array(
            'RegContentCode' => 'Register Content Code',
            'RegContentDesc' => 'Register Content Description',
            'RegContentRegisterCode' => 'Register Content register Coder',
            'RegContentRestAvail' => 'Register Content Rest Avail',
    );
    
    
            
    function onBeforeWrite() {
        parent::onBeforeWrite();
        
        if($this->isChanged('SchoolStatus') && $this->SchoolStatus == "Approved"){
            
            $submissions = SignUpSubmission::get()->filter(array('SchoolID' => $this->ID));
            foreach ($submissions as $sub){
                $sub->SchoolName = $this->SchoolName;
                $sub->SchoolLevel = $this->SchoolLevel;

                $sub->write();
            }
        }

    }
}

?>
