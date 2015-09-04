<?php

class CMSConfig extends DataObject
{

    static $db = array(
        'Name' => 'Varchar'

    );
    static $searchable_fields = array(
        'Name'
    );
    static $summary_fields = array(
        'Name'
    );
    static $indexes = array(
        'Name' => array(
            'type'  => 'unique',
            'value' => 'Name'
        )
    );

    protected static function getConfig($name, $valueField = null, $default = null)
    {
        $class  = get_called_class();
        $result = $class::get()->filter('Name', $name)->first();
        if (!$result || !$result->exists())
        {
            $result       = $class::create();
            $result->Name = $name;
            if ($valueField)
                $result->$valueField = $default;
            $result->write();
        }

        return $result;
    }

    /* CRUD
     */

    static $extensions = array(
        'SiteTreePermissions'
    );

    /**
     * @param Member $member
     *
     * @return bool|void
     */
    function canCreate($member = null)
    {
        return parent::canCreate($member) || $this->extendedCan('canCreate', $member);
    }

    /**
     * @param Member $member
     *
     * @return bool|void
     */
    function canView($member = null)
    {
        return parent::canView($member) || $this->extendedCan('canView', $member);
    }

    /**
     * @param Member $member
     *
     * @return bool|void
     */
    function canEdit($member = null)
    {
        return parent::canEdit($member) || $this->extendedCan('canEdit', $member);
    }

    /**
     * @param Member $member
     *
     * @return bool|void
     */
    function canDelete($member = null)
    {
        return parent::canDelete($member) || $this->extendedCan('canCreate', $member);
    }
}