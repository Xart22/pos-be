<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::get();

        return response()->json([
            'message' => 'Settings retrieved successfully',
            'data' => $settings
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = Setting::create($request->except('_token'));
            return response()->json([
                'message' => 'Setting created successfully',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error creating setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $setting = Setting::findOrFail($id);

        return response()->json([
            'message' => 'Setting retrieved successfully',
            'data' => $setting
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try {
            foreach ($request->data as $value) {
                Setting::updateOrCreate(['name' => $value['name']], ['value' => $value['value']]);
            }
            return response()->json([
                'message' => 'Settings updated successfully',
                'data' => Setting::all()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error updating setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $setting = Setting::findOrFail($id);
            $setting->delete();
            return response()->json([
                'message' => 'Setting deleted successfully',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting setting',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
