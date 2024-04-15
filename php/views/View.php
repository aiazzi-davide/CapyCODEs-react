<?php
class View{
    protected $data = [];
    protected $template;
    protected $engine;

    public function __construct($template ,$data = []){
        $this->engine = new LoadedEngine();
        $this->template = $template;
        $this->data = $data;
    }

    function render (){
        return $this->engine->render($this->template,$this->data);
    }

    function setData($data){
        $this->data = $data;
    }
}