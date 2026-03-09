<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class AdminAccount extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'admin_accounts';

    protected $fillable = [
        'role_id',
        'email',
        'password',
        'full_name',
        'phone_number',
    ];

    protected $hidden = ['password'];

    // Quan hệ với bảng roles
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    // Hàm kiểm tra quyền
    public function hasPermission($permission)
    {
        if (!$this->role || !is_array($this->role->permissions)) {
            return false;
        }

        if (in_array('*', $this->role->permissions)) {
            return true;
        }

        return in_array($permission, $this->role->permissions);
    }
}
