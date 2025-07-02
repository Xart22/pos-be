<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionDetail extends Model
{
    protected $guarded = [];


    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }


    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function variants()
    {
        return $this->hasMany(TransactionDetailVariant::class);
    }
}
