<?php

/*
 * author amir@infinity.io
 */

/**
 * Extends the functionality of the framework/forms/FormField.php class
 *
 */
class CustomFormField extends DataExtension {
    
    
    /* This function returns the data-bind attribute if it's defined
    *  
    */
    public function getDataBind() {
           $attr = $this->owner->getAttribute('data-bind');
           
           if ($attr) return $attr;
           
           return null;
    }
    
    /* This function returns the attribute $attr_name if it exists
     * otherwise returns null
     * @param String  $attr_name
     * @return  Mixed   String/Null
    */
    public function MyAttribute($attr_name) {
           $attr = $this->owner->getAttribute($attr_name);
           
           if ($attr) return $attr;
           
           return null;
                   
    }
    
    /* This function returns all classes excluding the mentioned class
     * @param String  $attr_name
     * @return  Mixed   String/Null
    */
    public function extraClassExclude($classes_to_exclude) {
        
        $classes = $this->owner->extraClasses;
        if($classes){
            $exclude = array();
            (is_array($classes_to_exclude)) ? $exclude = explode(',', $classes_to_exclude): $exclude[] = $classes_to_exclude;
            foreach ($exclude as $cls) {
                $pos = array_search($cls, $classes);
                if($pos !== false) unset($classes[$pos]);
            }
        }
        
        if(isset ($classes))
            return implode(' ', $classes);
        else
            return '';
    }
    
 /* Returns one CSS class
     * @param String  $attr_name
     * @return  Mixed   String/Null
    */
    public function returnCssClass($cssClass) {
        if($this->owner->hasClass($cssClass))
            return $cssClass;
        else
            return '';
    }
}

?>
