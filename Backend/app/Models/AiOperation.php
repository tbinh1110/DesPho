<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiOperation extends Model
{
    use HasFactory;

    protected $table = 'ai_operations';

    protected $fillable = [
        'user_id',
        'provider_id',
        'batch_id',
        'input_image_id',
        'output_image_id',
        'operation_type',
        'request_payload',
        'response_payload',
        'status',
        'error_message',
        'processing_time_ms'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function provider()
    {
        return $this->belongsTo(AiProvider::class, 'provider_id');
    }

    public function batch()
    {
        return $this->belongsTo(OperationBatch::class, 'batch_id');
    }

    public function inputImage()
    {
        return $this->belongsTo(Image::class, 'input_image_id');
    }

    public function outputImage()
    {
        return $this->belongsTo(Image::class, 'output_image_id');
    }

    public function parameters()
    {
        return $this->hasMany(AiParameter::class, 'operation_id');
    }

    public function objectSelections()
    {
        return $this->hasMany(ObjectSelection::class, 'operation_id');
    }
}
