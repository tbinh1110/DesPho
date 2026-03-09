<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperationBatch extends Model
{
    use HasFactory;

    protected $table = 'operation_batches';

    protected $fillable = [
        'user_id',
        'batch_name',
        'operation_type',
        'status'
    ];

    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function aiOperations()
    {
        return $this->hasMany(AiOperation::class, 'batch_id');
    }
}
