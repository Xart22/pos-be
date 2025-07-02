<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetailVariant extends Model
{
    protected $guarded = [];


    public function variantOption()
    {
        return $this->belongsTo(VariantOption::class, 'variant_options_id');
    }
}
