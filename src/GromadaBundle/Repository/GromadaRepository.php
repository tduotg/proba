<?php
namespace GromadaBundle\Repository;

use Doctrine\ORM\EntityRepository as Repository;



class GromadaRepository extends Repository
{
	public function getGromadaByKoatuu($koatuu) {

		$qb = $this->createQueryBuilder('g')
			->where('g.koatuu LIKE :user_koatuu')
			->setParameter('user_koatuu', $koatuu.'%')
			->getQuery()
			->getResult();
		return $qb;
	}

	public function ifPolygonWithin($geom, $idGromada) {
			$qb = $this->createQueryBuilder('g')
				->where('ST_Within(ST_GeomFromText(:polygon,3857), st_transform(g.geom,3857)) = true')
				->andWhere('g.id = :gromada_id')
				->andWhere('ST_IsValid(:polygon) = true')
				->setParameter(':polygon', $geom)
				->setParameter(':gromada_id', $idGromada)
				->getQuery()
				->getResult();
			return $qb;
	}
}
