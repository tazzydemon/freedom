<?php

class TagsText extends SiteText implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return array(
            '_textTags'      => '_t',
            '_plainTags' => '_tPlain'
        );
    }
}
