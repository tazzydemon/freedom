<?php

class SignUpTab2 extends SiteText implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return array(
            '_textTab2'      => '_t',
            '_plainTextTab2' => '_tPlain'
        );
    }
}