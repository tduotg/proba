<?php

namespace GromadaBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

/**
 * @ORM\Entity
 * @ORM\Table(name="fos_user")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer") 
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\OneToMany(targetEntity="GromadaBundle\Entity\SgPolygon", mappedBy="user")
     */
    private $sgPolygons;
    
    public function __construct()
    {
        parent::__construct();
        // your own logic
        $this->sgPolygons = new ArrayCollection();
    }
    /**
     * @return Collection|sgPolygons[]
     */
    public function getSgPolygons()
    {
        return $this->sgPolygons;
    }    
}