<?php

namespace GromadaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;


/**
 *
 * @Route("/")
 *
 */
class MapController extends Controller {

    /**
     * @Route("/", name="map_index",  options={"expose"=true})
     * @Method({"GET","POST"})
     */
    public function indexAction() {
        return $this->render('GromadaBundle:Map:index.html.twig');
    }

    //Змінюємо мову (condition: "request.isXmlHttpRequest()")
    public function setLocaleAction(Request $request) {
        if ($request->get('lang') == 'en') {
            $this->get('translator')->setLocale('en');
            $this->get('translator')->setFallbackLocales(array('en'));
            $this->get('session')->set('_locale', 'en');
        } else {
            $this->get('translator')->setLocale('uk');
            $this->get('translator')->setFallbackLocales(array('uk'));
            $this->get('session')->set('_locale', 'uk');
        }

        return new JsonResponse($this->get('translator')->getLocale(), 200);
    }

}
