<?php

namespace DKulyk\Restrictions\Nova\Actions;

use DKulyk\Restrictions\Entities\Restriction;
use DKulyk\Restrictions\RestrictionsScope;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Laravel\Nova\Actions\Action;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Http\Requests\ActionRequest;
use Laravel\Nova\Nova;
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
     * @param string $name
     */
    public function __construct(Resource $resource, $name = null)
    {
        $this->name = $name;
        $this->resource = $resource;
    }

    /**
     * @param  \Illuminate\Http\Request $request
     * @return bool
     */
    public function authorizedToSee(Request $request)
    {
        return ! is_null($this->getScope()) && parent::authorizedToSee($request);
    }

    /**
     * @return \DKulyk\Restrictions\RestrictionsScope|null
     */
    protected function getScope(): ?RestrictionsScope
    {
        return $this->resource->resource->getGlobalScopes()[RestrictionsScope::class] ?? null;
    }

    public function handleRequest(ActionRequest $request)
    {
        $model = $request->newQueryWithoutScopes()
            ->whereKey($request->post('resources'))
            ->firstOrFail();

        /** @var Restriction $restriction */
        $restriction = Restriction::query()
            ->whereIn('entity_type', [
                get_class($model),
                $model->getMorphClass(),
            ])
            ->where('entity_id', $model->getKey())
            ->firstOrNew([
                'restriction' => $request->post('restriction'),
            ]);

        $restriction->entity()->associate($model);
        $restriction->save();

        /** @var resource $restrictionResource */
        $restrictionResource = Nova::resourceForModel($restriction->restriction);

        switch ($request->query('method')) {
            case 'search':
                return $restrictionResource::buildIndexQuery(
                    $request, $restrictionResource::newModel()->newQuery(),
                    $request->post('search')
                )
                    ->take(5)
                    ->get()
                    ->map(function (Model $model) use ($restrictionResource) {
                        $resource = new $restrictionResource($model);

                        return [
                            'value' => $model->getKey(),
                            'label' => $resource->title(),

                        ];
                    });
            case 'update':
                $restriction->update($request->only(['enabled', 'type']));

                break;
            case 'attach':
                $model = $restriction->rules()->getModel()->newQuery()
                    ->withoutGlobalScopes()
                    ->findOrFail($request->post('rule'));

                $restriction->rules()->sync($model, false);

                break;
            case 'detach':
                $restriction->rules()->detach($request->post('rule'));

                break;
        }

        return [
            'enabled' => $restriction->enabled,
            'type' => $restriction->type,
            'rules' => $restriction->rules()->withoutGlobalScopes()
                ->get()
                ->map(function (Model $model) use ($restrictionResource) {
                    $resource = new $restrictionResource($model);

                    return [
                        'value' => $model->getKey(),
                        'label' => $resource->title(),

                    ];
                }),
        ];
    }

    public function jsonSerialize()
    {
        return array_merge(parent::jsonSerialize(), [
            'restrictions' => collect($this->getScope()->getAllowedRestrictions())->map(function (string $restriction) {
                return [
                    'value' => $restriction,
                    'label' => Nova::resourceForModel($restriction)::label(),
                ];
            }),
        ]);
    }

    public function fields()
    {
        return [
            Boolean::make('Активне', 'enabled'),
        ];
    }
}
