<?php

namespace GromadaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use GromadaBundle\Entity\SgPolygon;

/**
 *
 * @Route("/sgPolygon")
 *
 */
class SgPolygonController extends Controller {

    /**
     * @Route("/new", name="sg_polygon_new",  options={"expose"=true})
     * @Method({"POST"})
     */
    public function newAction(Request $request) {
        try {
            if (!in_array('ROLE_USER', $this->getUser()->getRoles())) {
                throw $this->createAccessDeniedException('Unable to create new.');
            }
            $em = $this->getDoctrine()->getManager();
            $userKoatuu = substr($this->getUser(), 0, 5);
            if (!preg_match('/^\d+$/', $userKoatuu)) {
                throw new \Exception('Доступ заборонено!');
            }
            $gromads = $em->getRepository('GromadaBundle:Gromada')->getGromadaByKoatuu($userKoatuu);
            if (empty($gromads)) {
                throw new \Exception('Доступ заборонено! Громаду з КОАТУУ ' . $userKoatuu . ' не знайдено!');
            }
            foreach ($gromads as $gromada) {
                $result = $em->getRepository('GromadaBundle:Gromada')->ifPolygonWithin($request->get('geom'), $gromada->getId());
                if ($result) {
                    $gromada = $result[0];
                    $data['gromadaName'] = $gromada->getNameUa();
                    $sgPolygon = new SgPolygon();
                    $form = $this->createForm('GromadaBundle\Form\SgPolygonNewType', $sgPolygon);
                    $form->get('geom')->setData($request->get('geom'));
                    $form->get('gromada_koatuu')->setData($gromada->getKoatuu());
                    $form->add('submit', SubmitType::class);

                    return new JsonResponse(array('data' => $this->renderView('GromadaBundle:Map/modal:confirmSaveSgPolygon.html.twig', array(
                            'gform' => $form->createView(),
                            'data' => $data,
                        ))), Response::HTTP_OK);
                }
            }
            throw new \Exception('Полігон повинен знаходитись в межах громади!');
        } catch (\Exception $exception) {
            return new JsonResponse(array('error' => $exception->getMessage()), Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/create", name="sg_polygon_create",  options={"expose"=true})
     * @Method({"POST"})
     */
    public function createAction(Request $request) {
        if (!in_array('ROLE_USER', $this->getUser()->getRoles())) {
            throw $this->createAccessDeniedException('Unable to create.');
        }
        $em = $this->getDoctrine()->getEntityManager();
        $response = new JsonResponse();
        $sgPolygon = new SgPolygon();
        $form = $this->createForm('GromadaBundle\Form\SgPolygonNewType', $sgPolygon);
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $data = $form->getData();
            $result = $em->createQuery("Select g from GromadaBundle:Gromada g where (ST_Within(ST_GeomFromText(:polygon,3857), st_transform(g.geom,3857)) = true) AND (g.koatuu = :gromada_koatuu)")
                    ->setParameter(':polygon', $data->getGeom())
                    ->setParameter(':gromada_koatuu', $form->get("gromada_koatuu")->getData());
            $response = new JsonResponse();
            if ($result) {
                $sgPolygon->setUser($this->getUser());
                $sgPolygon->setGeom($data->getGeom());
                $sgPolygon->setGromKoatuu($form->get("gromada_koatuu")->getData());
                $em->persist($sgPolygon);
                $em->flush();

                return ($response->setData(array('success' => true)));
            }
            throw $this->createAccessDeniedException('Unable to create.');
        }
        throw $this->createAccessDeniedException('Unable to create.');
    }

    /**
     * @Route("/ajaxGeometry", name="sg_polygon_ajax_geometry",  options={"expose"=true})
     * @Method({"POST"})
     */
    public function ajaxGeometryAction(Request $request) {
        try {
            $sgPolygon = $this->getDoctrine()->getRepository(SgPolygon::class)->find($request->get('input'));
            $em = $this->getDoctrine()->getEntityManager();
            $result = $em->createQuery("Select ST_AsText(ST_Multi(ST_GeomFromText(:geom))) from GromadaBundle:Gromada g") 
                    ->setMaxResults(1)
                    ->setParameter(':geom', $sgPolygon->getGeom());
            $geom = $result->getResult();
            $response = new JsonResponse();
            $response->setData(array(
                'geom' => $geom[0][1],
                'data' => $this->renderView('GromadaBundle:Map/modal:confirmRmSgPolygon.html.twig', array('id' => $request->get('input'))),
            ));

            return $response;
        } catch (Exception $exception) {
            return new JsonResponse(array('error' => $exception->getMessage()), Response::HTTP_BAD_REQUEST);
        }
    }

    /**
     * @Route("/remove", name="sg_polygon_remove",  options={"expose"=true})
     * @Method({"POST"})
     */
    public function removeAction(Request $request) {
        try {
            $sgPolygon = $this->getDoctrine()->getRepository(SgPolygon::class)->find($request->get('input'));
            if (!in_array('ROLE_USER', $this->getUser()->getRoles())) {
                throw $this->createAccessDeniedException('Unable to access.');
            }
            if ($this->getUser() !== $sgPolygon->getUser()) {
                throw $this->createAccessDeniedException('Unable to remove.');
            }
            $em = $this->getDoctrine()->getEntityManager();
            $em->remove($sgPolygon);
            $em->flush();
            $response = new JsonResponse();
            $response->setData(array('success' => true));

            return $response;
        } catch (Exception $exception) {
            return new JsonResponse(array('error' => $exception->getMessage()), Response::HTTP_BAD_REQUEST);
        }
    }

}
