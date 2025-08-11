<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Transaction extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function detail()
    {
        return $this->hasMany(TransactionDetail::class)->with('menu');
    }

    public function details()
    {
        return $this->hasMany(TransactionDetail::class);
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class);
    }
}
