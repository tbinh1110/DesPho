<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    protected $table = 'images';

    protected $fillable = [
        'user_id',
        'original_image_id',
        'image_url',
        'file_size',
        'width',
        'height',
        'format'
    ];

    const UPDATED_AT = null;

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function originalImage()
    {
        return $this->belongsTo(Image::class, 'original_image_id');
    }

    public function derivedImages()
    {
        return $this->hasMany(Image::class, 'original_image_id');
    }
}
