<?php

namespace GromadaBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Gromada
 *
 * @ORM\Table(name="gromady")
 * @ORM\Entity(repositoryClass="GromadaBundle\Repository\GromadaRepository")
 */
class Gromada
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }
    /**
     * @ORM\Column(type="geometry")
     */
    private $geom;
    
    /**
     * Set geom
     *
     * @param geometry $geom
     *
     * @return Gromada
     */
    public function setGeom($geom)
    {
        $this->geom = $geom;

        return $this;
    }

    /**
     * Get geom
     *
     * @return geometry
     */
    public function getGeom()
    {
        return $this->geom;
    }
    /**
     * @ORM\Column(type="string") 
     */
    private $koatuu;    
    /**
     * Set koatuu
     *
     * @param string $koatuu
     *
     * @return Gromada
     */
    public function setKoatuu($koatuu)
    {
        $this->koatuu = $koatuu;

        return $this;
    }

    /**
     * Get koatuu
     *
     * @return string
     */
    public function getKoatuu()
    {
        return $this->koatuu;
    }   
    
    /**
     * @ORM\Column(type="string") 
     */
    private $nameUa;
    /**
     * Set name_ua
     *
     * @param string $nameUa
     *
     * @return Gromada
     */
    public function setNameUa($nameUa)
    {
        $this->nameUa = $nameUa;

        return $this;
    }

    /**
     * Get nameUa
     *
     * @return string
     */
    public function getNameUa()
    {
        return $this->nameUa;
    }
    /**
     * @ORM\Column(type="integer", nullable=true) 
     */
    private $population;    
    /**
     * Set population
     *
     * @param string $population
     *
     * @return Gromada
     */
    public function setPopulation($population)
    {
        $this->population = $population;

        return $this;
    }
	

	/**
	 * @param mixed $id
	 */
	public function setId($id) {
		$this->id = $id;
	}

    /**
     * Get population
     *
     * @return string
     */
    public function getPopulation()
    {
        return $this->population;
    }    
    /**
     * @ORM\Column(type="string", nullable=true) 
     */
    private $wiki;    
    /**
     * Set wiki
     *
     * @param string $wiki
     *
     * @return Gromada
     */
    public function setWiki($wiki)
    {
        $this->wiki = $wiki;

        return $this;
    }

    /**
     * Get wiki
     *
     * @return string
     */
    public function getWiki()
    {
        return $this->wiki;
    }   
    /**
     * @ORM\Column(type="float") 
     */
    private $area;    
    /**
     * Set area
     *
     * @param float $area
     *
     * @return Gromada
     */
    public function setArea($area)
    {
        $this->area = $area;

        return $this;
    }

    /**
     * Get area
     *
     * @return float
     */
    public function getArea()
    {
        return $this->area;
    }    
    /**
     * @ORM\Column(type="float") 
     */
    private $perimeter;    
    /**
     * Set perimeter
     *
     * @param float $perimeter
     *
     * @return Gromada
     */
    public function setPerimeter($perimeter)
    {
        $this->perimeter = $perimeter;

        return $this;
    }

    /**
     * Get perimeter
     *
     * @return float
     */
    public function getPerimeter()
    {
        return $this->perimeter;
    }         
}