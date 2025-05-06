<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('categories', 'App\Http\Controllers\CategoriesController')->except(['show']);
    Route::get('categories/{category:uuid}', 'App\Http\Controllers\CategoriesController@show')->name('categories.show');

    Route::resource('locations', 'App\Http\Controllers\LocationsController')->except(['show']);
    Route::get('locations/{location:uuid}', 'App\Http\Controllers\LocationsController@show')->name('locations.show');

    Route::resource('items', 'App\Http\Controllers\ItemController')->except(['show']);
    Route::get('items/{item:uuid}', 'App\Http\Controllers\ItemController@show')->name('items.show');
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
