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
class PricingTable extends DataObject{
    static $db = array(
        'RegisterContent' => 'Varchar',   //Register content code (eg UN) plus Period of availability (eg 24)
        'PDFPrefix' => 'Varchar',
        'RegisterMap' => 'Varchar',
        'Network' => 'Varchar',
        'PriceCode' => 'Varchar',
        'GXP' => 'Varchar(255)',
    );

    static $searchable_fields = array(
        'Network',
        'RegisterContent',
        'GXP'
    );
    static $summary_fields = array(

        'RegisterContent' => 'Register Content',   //Register content code (eg UN) plus Period of availability (eg 24)
        'PDFPrefix' => 'PDF Prefix',
        'RegisterMap' => 'Register Map',
        'Network' => 'Network',
        'PriceCode' => 'Price Code',
        'GXP' => 'GXP',
    );

}

?>
