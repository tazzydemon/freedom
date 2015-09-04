<?php

class SignUpRadioLabels extends SiteText implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return array(
            '_textRadioLabels'      => '_t',
            '_plainTextRadioLabels' => '_tPlain'
        );
    }
}