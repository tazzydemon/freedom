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
class School extends DataObject{
    static $db = array(
        'SchoolName' => 'Varchar',
        'SchoolLevel' => 'Varchar',
        'SchoolStatus' => "Enum('Approved, Not Approved','Not Approved')",
    );
    
    static $searchable_fields = array(
        'SchoolName',
        'SchoolLevel',
        'SchoolStatus'
    );
    static $summary_fields = array(
        'SchoolName'     => 'Name',
        'SchoolLevel' => 'Level',
        'SchoolStatus'   => 'Status'
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
