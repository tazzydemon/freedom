<?php

/**
 * Allows you to enable configuration of generic strings. These can then be retrieved anywhere they're needed. Good for
 * general button labels, header/footer text, site name, etc.
 * @author  Nik Rolls <nik@rolls.cc>
 * @package CMSConfig
 */
class SiteText extends CMSConfig implements TemplateGlobalProvider
{

    static $db = array(
        'Text'   => 'VarChar(700)',
        'Usages' => 'Text'
    );
    static $searchable_fields = array(
        'Name',
        'Text',
        'Usages'
    );
    static $summary_fields = array(
        'Name'     => 'Name',
        'NiceText' => 'Text',
        'Usages'   => 'Usages'
    );


    function getNiceText()
    {
        return static::_tPlain($this->Name);
    }

    function getCMSFields()
    {
        $fields = parent::getCMSFields();
        $fields->insertBefore($fields->dataFieldByName('Name')->performReadonlyTransformation(), '');
        $fields->insertAfter($fields->dataFieldByName('Usages')->performReadonlyTransformation(), 'Name');

        return $fields;
    }

    /**
     * Gets a string from the SiteText database.
     *
     * @param string      $name    The identifier slug
     * @param null|string $default The default value for the string
     * @param string      $usage   Optional context for where it's being used. This helps the admins decide what text to enter
     *
     * @return string
     */
    public static function _t($name, $default = null, $usage = null)
    {
        $text = parent::getConfig($name, 'Text', $default);
        if ($usage && stristr($text->Usage, $usage) === false)
        {
            $usages = explode(';', $text->Usage);
            array_walk($usages, function (&$val)
            {
                $val = trim($val, ' ;');
            });

            $usages[]     = $usage;
            $text->Usages = implode('; ', array_filter(array_keys(array_flip($usages))));
            $text->write();
        }

        return $text->Text;
    }

    /**
     * As with _text, except that it strips HTML from the string
     *
     * @param string      $name    The identifier slug
     * @param null|string $default The default value for the string
     * @param string      $usage   Optional context for where it's being used. This helps the admin decide what text to enter
     *
     * @return string
     */
    public static function _tPlain($name, $default = null, $usage = '')
    {
        return trim(preg_replace('#\s{2,}#', ' ', preg_replace('#<[^>]*>#', ' ', static::_t($name, $default, $usage))));
    }

    public static function get_template_global_variables()
    {
        return array(
            '_text'      => '_t',
            '_plainText' => '_tPlain'
        );
    }
}