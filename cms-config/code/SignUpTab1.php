<?php

class SignUpTab1 extends SiteText implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return array(
            '_textTab1'      => '_t',
            '_plainTextTab1' => '_tPlain'
        );
    }
}
