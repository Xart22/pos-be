<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Variant extends Model
{
    protected $guarded = [];

    protected $hidden = ['created_at', 'updated_at'];


    protected $with = ['options'];

    public function options()
    {
        return $this->hasMany(VariantOption::class)->orderBy('position');
    }
}
