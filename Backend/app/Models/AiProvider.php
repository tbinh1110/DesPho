<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AiProvider extends Model
{
    use HasFactory;

    protected $table = 'ai_providers';

    protected $fillable = [
        'name',
        'base_url',
    ];

    const UPDATED_AT = null;

    public function aiOperations()
    {
        return $this->hasMany(AiOperation::class, 'provider_id');
    }
}
