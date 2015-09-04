<?php

global $project;
$project = 'mysite';


global $database;
$database = 'pulse';

// Use _ss_environment.php file for configuration
require_once("conf/ConfigureFromEnv.php");

// Set the site locale
i18n::set_locale('en_NZ');

//Define all the dataExtensions here
Object::add_extension('FormField', 'CustomFormField');


SS_Log::add_writer(new SS_LogFileWriter('/home/ss/domains/signup.pulseenergy.co.nz/public_html/mysite/errors.log'), SS_Log::ERR);
SS_Log::add_writer(new SS_LogEmailWriter('julian@bitstream.co.nz'), SS_Log::WARN, '<=');

//ini_set("log_errors", "On");
//ini_set("error_log", "/mysite/logfile");

//Email::send_all_emails_to('julian@bitstream.co.nz');
//Force enviroment to Dev ** REMOVE FOR LIVE SITES **

//
//print_r(TEMP_FOLDER);
SS_Cache::add_backend('two-level', 'TwoLevels', array(
        'slow_backend' => 'File',
        'fast_backend' => 'Apc',
        'slow_backend_options' => array(
                'cache_dir' => TEMP_FOLDER . DIRECTORY_SEPARATOR . 'cache'
)
));

// No need for special backend for aggregate - TwoLevels with a File slow
// backend supports tags
SS_Cache::pick_backend('two-level', 'Two-Levels', 10);

//Force cache to flush on page load if in Dev mode (prevents needing ?flush=1 on the end of a URL)
if (Director::isDev()) {
    SS_Cache::set_cache_lifetime('any', -1, 100);
}
else{

}
