<?php

namespace App\Http\Controllers;

use App\Models\locations;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LocationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $locations = locations::all();

        return Inertia::render('locations/index', compact('locations'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('locations/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string',
        ]);

        locations::create($request->all());

        return redirect()->route('locations.index')->with('success', 'Location created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(locations $locations)
    {
        return Inertia::render('locations/show', compact('locations'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(locations $locations)
    {
        return Inertia::render('locations/edit', compact('locations'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, locations $locations)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'required|string',
        ]);

        $locations->update($request->all());

        return redirect()->route('locations.index')->with('success', 'Location updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(locations $locations)
    {
        $locations->delete();

        return redirect()->route('locations.index')->with('success', 'Location deleted successfully.');
    }
}
