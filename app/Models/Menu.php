<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    protected $guarded = [];
    protected $hidden = ['created_at', 'updated_at', 'category_id'];

    protected $with = ['category', 'variants'];
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function variants()
    {
        return $this->hasMany(MenuOption::class, 'menu_id')->with('variant');
    }
}
