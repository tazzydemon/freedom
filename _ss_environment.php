<?php

// These three defines set the database connection details.
define('SS_DATABASE_SERVER', 'localhost');
define('SS_DATABASE_USERNAME', 'ss');
define('SS_DATABASE_PASSWORD', '1aClarence');

// su_ = survey
// si_ = signup
define('SS_DATABASE_PREFIX', 'si_');
if (isset($_SERVER['HTTP_HOST'])) {

    if((strpos('_'.$_SERVER['HTTP_HOST'], '-stg') || strpos('_'.$_SERVER['HTTP_HOST'], '-dev')) !== false)
        define('SS_ENVIRONMENT_TYPE', 'dev');
    else
        define('SS_ENVIRONMENT_TYPE', 'live');

//    if (strpos($_SERVER['HTTP_HOST'], '-stg') !== false) {
//        define('SS_ENVIRONMENT_TYPE', 'test');
//    }
//    elseif (strpos($_SERVER['HTTP_HOST'], '-dev') !== false) {
//        define('SS_ENVIRONMENT_TYPE', 'dev');
//    }
//    else {
//        define('SS_ENVIRONMENT_TYPE', 'live');
//    }
}
else {
    define('SS_ENVIRONMENT_TYPE', 'live');
}
$_FILE_TO_URL_MAPPING['/home/ss/domains/signup.pulseenergy.co.nz/public_html'] = 'http://signup-stg.pulseenergy.co.nz';


define('TEMP_FOLDER', '/home/ss/domains/signup.pulseenergy.co.nz/public_html/silverstripe-cache');

// These two defines sets a default login which, when used, will always log
// you in as an admin, even creating one if none exist.
define('SS_DEFAULT_ADMIN_USERNAME', 'admin');
define('SS_DEFAULT_ADMIN_PASSWORD', '!Pul$e%');

