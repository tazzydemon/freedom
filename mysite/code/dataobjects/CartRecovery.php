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
class CartRecovery extends DataObject{
    static $db = array(
            'UniqueID'  => 'Varchar',
            'CustomerName' => 'Varchar',
            'CustomerContactNumber' => 'Varchar',
            'CustomerJSON' => 'Varchar(4096)',
            'EmailSent' => 'boolean',
            'CartComplete' => 'boolean'
    );
    
    static $searchable_fields = array(
        'CustomerName',
        'EmailSent',
        'CartComplete',
        'CustomerContactNumber',
    );

//    public function getDefaultSearchContext() {
//        $fields = $this->scaffoldSearchFields(array(
//            'restrictFields' => array('LastEdited')
//        ));
//
//        $filters = array(
//            'LastEdited' => new GreaterThanFilter('LastEditedUpper'),
//        'LastEdited' => new LessThanFilter('LastEditedLower')
//        );
//
//        return new SearchContext(
//            $this->class,
//            $fields,
//            $filters
//        );
//    }


    static $summary_fields = array(
            'ID'=> 'ID',
            'UniqueID'=> 'Unique ID',
            'LastEdited'=> 'Last Edited',
            'CustomerName' => 'Customer Name',
            'CustomerContactNumber' => 'Contact Number',
            'EmailSent'=> 'Email Sent',
            'CartComplete'=> 'Cart Complete'
    //,
    //        'CustomerJSON' => 'JSON Data',



    );
    
    

}

?>
