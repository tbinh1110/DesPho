<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditTransaction extends Model
{
    use HasFactory;

    protected $table = 'credit_transactions';

    protected $fillable = [
        'user_id',
        'operation_id',
        'amount',
        'type'
    ];

    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function operation()
    {
        return $this->belongsTo(AiOperation::class, 'operation_id');
    }
}
