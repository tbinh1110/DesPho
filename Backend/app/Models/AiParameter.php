<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiParameter extends Model
{
    use HasFactory;

    protected $table = 'ai_parameters';

    protected $fillable = [
        'operation_id',
        'param_name',
        'param_value'
    ];

    public $timestamps = false;

    public function operation()
    {
        return $this->belongsTo(AiOperation::class, 'operation_id');
    }
}
