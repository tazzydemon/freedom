<?php

class SignUpTab3 extends SiteText implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return array(
            '_textTab3'      => '_t',
            '_plainTextTab3' => '_tPlain'
        );
    }
}