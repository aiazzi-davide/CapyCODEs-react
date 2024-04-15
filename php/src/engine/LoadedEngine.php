<?php
class LoadedEngine extends Mustache_Engine{
    public function __construct($options = []){
        parent::__construct([
            'template_class_prefix' => '__MyTemplates_',
            'cache' => '/tmp/cache/mustache',
            'cache_file_mode' => 0666, // Please, configure your umask instead of doing this :)
            'cache_lambda_templates' => true,
            'loader' => new Mustache_Loader_FilesystemLoader(getcwd().'/templates',['extension'=>'.mst']),
            'partials_loader' => new Mustache_Loader_FilesystemLoader(getcwd().'/templates/partials',['extension'=>'.mst'])
        ]);
    }
}