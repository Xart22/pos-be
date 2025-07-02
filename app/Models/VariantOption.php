<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariantOption extends Model
{
    protected $guarded = [];

    protected $hidden = ['created_at', 'updated_at'];


    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}
