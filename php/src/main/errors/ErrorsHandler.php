<?php

class ErrorsHandler
{
    public static function handleErrors($app)
    {
        $customErrorHandler = function (
            Psr\Http\Message\ServerRequestInterface $request,
            Throwable $exception,
            bool $displayErrorDetails,
            bool $logErrors,
            bool $logErrorDetails
        ) use ($app) {
            $payload = ['error' => $exception->getMessage()];
            $response = $app->getResponseFactory()->createResponse();
            $response->getBody()->write(
                json_encode($payload, JSON_UNESCAPED_UNICODE)
            );
            return $response->withHeader('Content-Type', 'application/json')->withStatus(500);
        };

        $errorMiddleware = $app->addErrorMiddleware(true, true, true);
        $errorMiddleware->setDefaultErrorHandler($customErrorHandler);
    }
}