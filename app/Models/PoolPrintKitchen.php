<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PoolPrintKitchen extends Model
{
    protected $fillable = [
        'transaction_id',
        'printed',
    ];

    protected $casts = [
        'printed' => 'boolean',
    ];


    public function transaction()
    {
        return $this->belongsTo(Transaction::class, 'transaction_id')->with(
            'details.menu',
            'details.variants.variantOption.variant'
        );
    }
}
