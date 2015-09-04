<?php
/**
 * Created by JetBrains PhpStorm.
 * User: nik_000
 * Date: 31/05/13
 * Time: 4:45 PM
 * To change this template use File | Settings | File Templates.
 */

class CMSConfigAdmin extends ModelAdmin
{
    static $managed_models = array(
//        'SiteText',
        'SignUpTab1'        => array('title'=>'Your Home'),
        'SignUpTab2'        => array('title'=>'Your Price'),
        'SignUpTab3'        => array('title'=>'Payment Options'),
        'SignUpSummary'     => array('title'=>'Summary Section'),
        'SignUpRadioNotes'  => array('title'=>'Radio Notes'),
        'SignUpRadioLabels' => array('title'=>'Radio Labels'),
        'TagsText' => array('title'=>'Tags')
    );
    static $url_segment = 'cms-config';
    static $menu_title = 'Form Data';

    public function getEditForm($id = null, $fields = null){
        /** @var Form $form */
        $form = parent::getEditForm($id, $fields);
        /** @var GridField $gridField */
        $gridField = $form->Fields()->dataFieldByName($this->sanitiseClassName($this->modelClass));
        /** @var GridFieldConfig $gridFieldConfig */
        $gridFieldConfig = $gridField->getConfig();

        $gridFieldConfig->removeComponentsByType('GridFieldDeleteAction');
        $gridFieldConfig->removeComponentsByType('GridFieldPrintButton');
        //$gridFieldConfig->removeComponentsByType('GridFieldExportButton');
  //careful
        //$gridFieldConfig->removeComponentsByType('GridFieldAddNewButton');
        return $form;
    }
}