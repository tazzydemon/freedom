<?php

class PulseAPI extends Controller {
    
        protected static $authenticator = 'BasicAPIAuthenticator';
        private static $allowed_actions = array(
		'index'
	);
	
	public function init()
	{
	    parent::init();
	}
	
	static $url_handlers = array(
		'$ClassName/$ID/$ACTION/$Other_ID' => 'handleAction'
		#'$ClassName/#ID' => 'handleItem',
		#'$ClassName' => 'handleList',
	);
	
	function index() {
		if(!isset($this->urlParams['ClassName'])) return $this->notFound();
		$className = $this->urlParams['ClassName'];
		$id = (isset($this->urlParams['ID'])) ? $this->urlParams['ID'] : null;
		$secondParam = (isset($this->urlParams['Other_ID'])) ? $this->urlParams['Other_ID'] : null;
		$action = (isset($this->urlParams['ACTION'])) ? $this->urlParams['ACTION'] : null;
		
		// Check input formats
		if(!class_exists($className)) return $this->notFound();
		if($id && !is_numeric($id)) return $this->notFound();
		if(!$action) return $this->methodNotAllowed();

		//SecurityID check, protect against CSRF attacks
		if(!SecurityToken::inst()->checkRequest($this->request)) {
                    return $this->authorizationFailure("Forbidden: Security token is not valid");
                }
                    
		// handle different HTTP verbs
		if($this->request->isGET() || $this->request->isHEAD()) {
                    if($secondParam)
                            return $className::$action($id,$secondParam);
                    else
                            return $className::$action($id);
		}
		if($this->request->isPOST()) {
		}
		
		if($this->request->isPUT()) {
		}
		
		if($this->request->isDELETE()) {
		}

		// if no HTTP verb matches, return error
		return $this->methodNotAllowed();
	}
        
        protected function authorizationFailure($message) {
		// return a 403
		$this->getResponse()->setStatusCode(403);
		$this->getResponse()->addHeader('Content-Type', 'text/plain');
		return $message;
	}

	protected function notFound() {
		// return a 404
		$this->getResponse()->setStatusCode(404);
		$this->getResponse()->addHeader('Content-Type', 'text/plain');
		return "That object wasn't found";
	}
	
	protected function methodNotAllowed() {
		$this->getResponse()->setStatusCode(405);
		$this->getResponse()->addHeader('Content-Type', 'text/plain');
		return "Method Not Allowed";
	}
	
	protected function unsupportedMediaType() {
		$this->response->setStatusCode(415); // Unsupported Media Type
		$this->getResponse()->addHeader('Content-Type', 'text/plain');
		return "Unsupported Media Type";
	}
}