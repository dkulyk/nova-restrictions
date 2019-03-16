<?php

namespace DKulyk\Restricitons\Nova\Actions;

use Closure;
use DKulyk\Restrictions\RestrictionsScope;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Resource;

class RestrictionsAction extends Action
{
    public $component = 'dkulyk-action-restrictions';

    /**
     * @var \Laravel\Nova\Resource
     */
    private $resource;

    /**
     * RestrictionsAction constructor.
     *
     * @param \Laravel\Nova\Resource $resource
     * @param $name
     */
    public function __construct(Resource $resource, $name = null)
    {
        $this->name = $name;
        $this->resource = $resource;
    }

    public function canSee(Closure $callback)
    {
        return array_key_exists(RestrictionsScope::class, $this->resource->resource->getGlobalScopes());
    }
}
