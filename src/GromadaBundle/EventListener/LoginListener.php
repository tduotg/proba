<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace GromadaBundle\EventListener;

use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Security\Http\SecurityEvents;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

// use Psr\Log\LoggerInterface;
/**
 * Listener responsible to change the redirection at the end of the password resetting
 */
class LoginListener implements EventSubscriberInterface {

    private $container;
    protected $requestStack;
    protected $logger;

    public function __construct($container, $requestStack, $logger) {
        $this->container = $container;
        $this->requestStack = $requestStack;
        $this->logger = $logger;
    }

    /**
     * {@inheritDoc}
     */
    public static function getSubscribedEvents() {
        return array(
            FOSUserEvents::SECURITY_IMPLICIT_LOGIN => 'onLogin',
            SecurityEvents::INTERACTIVE_LOGIN => 'onLogin',
        );
    }

    public function onLogin($event) {
        if ($event instanceof UserEvent) {
            $user = $event->getUser();
        }
        if ($event instanceof InteractiveLoginEvent) {
            $user = $event->getAuthenticationToken()->getUser();
        }
        $request = $this->requestStack->getCurrentRequest();
        $logger = $this->logger;
        $logger->info('Login user ' . $user->getUsername() . ' ' . $request->getClientIp());
    }

}
