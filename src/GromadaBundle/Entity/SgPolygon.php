<?php

namespace GromadaBundle\Entity;
use Gedmo\Mapping\Annotation as Gedmo;
use Doctrine\ORM\Mapping as ORM;

/**
 * SgPolygon
 *
 * @ORM\Table(name="sg_polygon")
 * @ORM\Entity(repositoryClass="GromadaBundle\Repository\SgPolygonRepository")
 */
class SgPolygon
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;
    /**
     * @ORM\Column(type="geometry")
     */
    private $geom;
    
    /**
     * Set geom
     *
     * @param geometry $geom
     *
     * @return SgPloygon
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
    private $gromKoatuu;    
    /**
     * Set gromKoatuu
     *
     * @param string $gromKoatuu
     *
     * @return SgPloygon
     */
    public function setGromKoatuu($gromKoatuu)
    {
        $this->gromKoatuu = $gromKoatuu;

        return $this;
    }

    /**
     * Get gromKoatuu
     *
     * @return string
     */
    public function getGromKoatuu()
    {
        return $this->gromKoatuu;
    }  

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
     * @ORM\ManyToOne(targetEntity="\GromadaBundle\Entity\User", inversedBy="sgPolygons")
     * @ORM\JoinColumn(nullable=true)
     */
    private $user;

    /**
     * Set user
     *
     * @param \GromadaBundle\Entity\User $user
     *
     * @return SgPolygon
     */
    public function setUser(\GromadaBundle\Entity\User $user = null)
    {
        $this->user = $user;
        return $this;
    }  
    /**
     * Get user
     *
     * @return \GromadaBundle\Entity\User $user
     */
    public function getUser()
    {
        return $this->user;
    }      
    /**
     * @var \DateTime $created
     *
     * @Gedmo\Timestampable(on="create")
     * @ORM\Column(type="datetime")
     */
    private $created;

    public function getCreated()
    {
        return $this->created;
    }
    /**
     * @ORM\Column(type="float",nullable=true) 
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
}