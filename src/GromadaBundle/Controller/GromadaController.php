<?php

namespace GromadaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Elastica\Query\MultiMatch;
use Symfony\Component\Config\Definition\Exception\Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;


/**
 *
 * @Route("/gromada")
 *
 */
class GromadaController extends Controller
{
	/**
	 * @Route("/autocompleteElastic", name="gromada_autocomplete_elastic",  options={"expose"=true})
	 * @Method({"GET", "POST"})
	 */
	public function autocompleteElasticAction(Request $request) {
		try{
			$finder = $this->container->get('fos_elastica.finder.commune.gromada');
			$fieldsQuery = new MultiMatch();
			$fieldsQuery->setFields(['nameUa']);
			$fieldsQuery->setQuery($request->get('input'));
			$data = $finder->find($fieldsQuery);
			$out = array();
			foreach ($data as $result) {
				$res = array();
				$res['name'] = $result->getNameUa();
				$res['id'] = $result->getId();
				$out[] = $res;
			}
			$serializer = $this->container->get('serializer');
			$json = $serializer->serialize($data, 'json');
			$response = new JsonResponse();
			$response->setData(array('success' => true, 'data' => $out));
			return $response;
		}catch (Exception $exception){
			return new JsonResponse(array('error' => $exception->getMessage()), Response::HTTP_BAD_REQUEST);
		}
	}

	/**
	 * @Route("/search", name="gromada_search",  options={"expose"=true})
	 * @Method({"GET", "POST"})
	 */
	public function searchAction(Request $request) {
		$finder = $this->container->get('fos_elastica.finder.commune.gromada');
		$fieldsQuery = new MultiMatch();
		$fieldsQuery->setFields(['nameUa']);
		$fieldsQuery->setQuery($request->get('input')['name']);
		$data = $finder->find($fieldsQuery);
		$response = new JsonResponse();
		$response->setData(array('success' => true, 'geom' => $data[0]->getGeom()));

		return $response;
	}



}