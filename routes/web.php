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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
