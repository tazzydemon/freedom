<?php

class SlideImage extends DataObject {

      public static $plural_name = 'Slide Images';
      public static $singular_name = 'Slide Image';


    private static $db = array(
        'Name' => 'Varchar(255)',
        'Caption' => 'HTMLText',

      //  'LinkHTML' => 'HTMLText',
        'SortID' => 'Int',
        'CaptionPosition' => "Enum('TopRight,BottomRight')"

    );
    private static $has_one = array(
        'Image' => 'Image',
        'Page' => 'Page',
        'LinkURL' => 'SiteTree'
    );
    private static $has_many = array(
    );

// Summary fields
    public static $summary_fields = array(
        'SortID' => 'SortID',
        'Image.CMSThumbnail' => 'Image',
        'Title' => 'Title',
        'ID' => 'ID'
    );
    public static $default_sort = 'SortID Desc';
    public static $defaults = array(
        'CaptionPosition' => 'BottomRight',
    );
    /*
     * CMSFields
     * **************************************
     */

    function getCMSFields() {
        $fields = parent::getCMSFields();
        $imageField =  new UploadField('Image','Choose Images');
        $imageField->setFolderName('Uploads/promotionalbanners');
        $imageField->setRecord($this);
     //   $this->write();
       // HtmlEditorConfig::set_active('reduced');
        $captionField = new HtmlEditorField('Caption', 'Image Caption');
        $captionField->setRows(5);
        $newFieldsArray = array(
            new TextField('Name'),
            $captionField,
           //new TextField('ImageLinkURL'),
        );

        $newFieldsArray_Advanced = array(
            new TextField('SortID'),
        //    new TextAreaField('ImageLinkHTML'),
        );
        $fields->removeFieldFromTab('Root.Main','PageID');
        $fields->addFieldsToTab("Root.Main", $newFieldsArray);
        $fields->addFieldsToTab("Root.Main", $imageField);
        $fields->addFieldsToTab("Root.Advanced", $newFieldsArray_Advanced);

        return $fields;
    }

    /*
     * Extra Functions
     * **************************************
     */

    function onBeforeWrite() {
        parent::onBeforeWrite();
        if (!$this->SortID) {
            $this->SortID = $this->getNextSortID();
        }
    }

    function onAfterWrite() {
        parent::onAfterWrite();
        /*
          $getDataList = $this->SGallery()->Images();
          if (!$getDataList || $getDataList->Count() == 0) {
          $nextSortID = 22;
          } else {

          $nextSortID = $getDataList->last()->SortID+1;
          }
          if (!$this->SortID && $this->SGalleryID) {
          $this->SortID = $nextSortID;
          $this->write();
          }
         * 
         */
    }

    function getNextSortID() {
        $getDataList = $this->Page()->SlideImage();
//        $parentID = $this->HeroPage()->ID;
//        $ParentImages = $this->HeroPage()->Images();
//        $ParentLastImageSortID = $this->HeroPage()->Images()->last()->SortID;

        if (!$getDataList || $getDataList->Count() == 0) {
            return NULL;
        } else {

            return $getDataList->first()->SortID + 1;
        }
    }

    public static function ThumbnailImage() {

    }

    public static function FullImage() {

    }

     public function test() {
        return print $this->getNextSortID();
    }

}

/*

    function onBeforeWrite() {
        parent::onBeforeWrite();
        if (!$this->SortID) {
            $this->SortID = $this->getNextSortID();
        }
    }


    function getNextSortID() {
        $getDataList = $this->SGallery()->Images();
        if (!$getDataList || $getDataList->Count() == 0) {
            return NULL;
        } else {

            return $getDataList->last()->SortID + 1;
        }
    }
 * 
 */