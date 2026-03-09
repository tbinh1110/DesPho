<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ObjectSelection extends Model
{
    use HasFactory;

    protected $table = 'object_selections';

    protected $fillable = [
        'operation_id',
        'x',
        'y',
        'width',
        'height'
    ];

    public $timestamps = false;

    public function operation()
    {
        return $this->belongsTo(AiOperation::class, 'operation_id');
    }
}
