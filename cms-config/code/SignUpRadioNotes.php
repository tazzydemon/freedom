<?php

class SignUpRadioNotes extends SiteText implements TemplateGlobalProvider
{
    public static function get_template_global_variables()
    {
        return array(
            '_textRadioNotes'      => '_t',
            '_plainTextRadioNotes' => '_tPlain'
        );
    }
}