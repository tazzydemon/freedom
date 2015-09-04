<?php

class SignUpSummary extends SiteText implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return array(
            '_textSummary'      => '_t',
            '_plainTextSummary' => '_tPlain'
        );
    }
}