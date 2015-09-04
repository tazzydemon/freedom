<?php
require_once 'Zend/Date.php';

/**
 * Form field to display an editable date string,
 * either in a single `<input type="text">` field,
 * or in three separate fields for day, month and year.
 * 
 * # Configuration
 * 
 * - 'showcalendar' (boolean): Determines if a calendar picker is shown.
 *    By default, jQuery UI datepicker is used (see {@link DateField_View_JQuery}).
 * - 'jslocale' (string): Overwrites the "Locale" value set in this class.
 *    Only useful in combination with {@link DateField_View_JQuery}.
 * - 'dmyfields' (boolean): Show three input fields for day, month and year separately.
 *    CAUTION: Might not be useable in combination with 'showcalendar', depending on the used javascript library
 * - 'dmyseparator' (string): HTML markup to separate day, month and year fields.
 *    Only applicable with 'dmyfields'=TRUE. Use 'dateformat' to influence date representation with 'dmyfields'=FALSE.
 * - 'dmyplaceholders': Show HTML5 placehoder text to allow identification of the three separate input fields
 * - 'dateformat' (string): Date format compatible with Zend_Date.
 *    Usually set to default format for {@link locale} through {@link Zend_Locale_Format::getDateFormat()}.
 * - 'datavalueformat' (string): Internal ISO format string used by {@link dataValue()} to save the
 *    date to a database.
 * - 'min' (string): Minimum allowed date value (in ISO format, or strtotime() compatible).
 *    Example: '2010-03-31', or '-7 days'
 * - 'max' (string): Maximum allowed date value (in ISO format, or strtotime() compatible).
 *    Example: '2010-03-31', or '1 year'
 * 
 * Depending which UI helper is used, further namespaced configuration options are available.
 * For the default jQuery UI, all options prefixed/namespaced with "jQueryUI." will be respected as well.
 * Example: <code>$myDateField->setConfig('jQueryUI.showWeek', true);</code>
 * See http://docs.jquery.com/UI/Datepicker for details.
 * 
 * # Localization
 * 
 * The field will get its default locale from {@link i18n::get_locale()}, and set the `dateformat`
 * configuration accordingly. Changing the locale through {@link setLocale()} will not update the 
 * `dateformat` configuration automatically.
 * 
 * See http://doc.silverstripe.org/framework/en/topics/i18n for more information about localizing form fields.
 * 
 * # Usage
 * 
 * ## Example: German dates with separate fields for day, month, year
 * 
 *   $f = new DateField('MyDate');
 *   $f->setLocale('de_DE');
 *   $f->setConfig('dmyfields', true);
 * 
 * # Validation
 * 
 * Caution: JavaScript validation is only supported for the 'en_NZ' locale at the moment,
 * it will be disabled automatically for all other locales.
 * 
 * @package forms
 * @subpackage fields-datetime
 */
class NZDateField extends DateField {


	public function Type() {
		return 'dateNZ text';
	}
		

}

