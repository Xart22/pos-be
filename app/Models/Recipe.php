<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Recipe extends Model
{
    protected $guarded = [];



    public function bahanBakus()
    {
        return $this->hasMany(Bahan::class, 'recipe_id')->with('bahanBaku');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }
}
