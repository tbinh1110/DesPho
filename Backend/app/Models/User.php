<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = [
        'email',
        'password',
        'phone_number',
        'google_id',
        'full_name',
        'credits',
        'role',
    ];

    public function images()
    {
        return $this->hasMany(Image::class, 'user_id');
    }

    public function operationBatches()
    {
        return $this->hasMany(OperationBatch::class, 'user_id');
    }

    public function aiOperations()
    {
        return $this->hasMany(AiOperation::class, 'user_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id');
    }

    public function creditTransactions()
    {
        return $this->hasMany(CreditTransaction::class, 'user_id');
    }
}
