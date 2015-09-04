<?php

class CustomSiteConfig extends DataExtension {

    private static $db = array(
                'Megamenu' => 'HTMLText',
                'Footer' => 'HTMLText',
                'Slogan' => 'HTMLText'
            );
    private static $has_one =  array(
                'SiteLogo' => 'Image',
                'SiteMobileLogo' => 'Image'

    );

    public function updateCMSFields(FieldList $fields) {


        $fields->addFieldToTab("Root.Main", new UploadField("SiteLogo", "Logo"));
        $fields->addFieldToTab("Root.Main", new UploadField("SiteMobileLogo", "Mobile Logo"));
//        $fields->addFieldToTab("Root.Main", new HtmlEditorField('Megamenu','Megamenu'));
        $fields->addFieldToTab("Root.Main", new HtmlEditorField('Footer','Footer'));
//        $fields->addFieldToTab("Root.Main", new HtmlEditorField('Slogan','Slogan'));
    }

    public function About($args){
        if (Director::get_current_page()->URLSegment == 'home' && isset($args['id'])){
            $about = '<a data-reveal-id="'.$args['id'].'">About</a> |&nbsp;';
            return $about;
        }
    }
}