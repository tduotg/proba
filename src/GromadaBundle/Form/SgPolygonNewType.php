<?php

namespace GromadaBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
// use Symfony\Component\OptionsResolver\OptionsResolver;
class SgPolygonNewType extends AbstractType
{
    /**
     * @param FormBuilderInterface $builder
     * @param array $options
     */
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
              ->add('geom',HiddenType::class)
              ->add('gromada_koatuu',HiddenType::class,array('mapped'=>false));
    }
}