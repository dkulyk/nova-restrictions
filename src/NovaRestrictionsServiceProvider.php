<?php

namespace DKulyk\Restrictions;

use Laravel\Nova\Nova;
use Laravel\Nova\Events\ServingNova;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

final class NovaRestrictionsServiceProvider extends ServiceProvider
{
    public function boot()
    {
        Event::listen(ServingNova::class, function () {
            Nova::script('dkulyk-restrictions', dirname(__DIR__) . '/dist/js/restrictions.js');
        });
    }
}