<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\AdminAccount;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $admin = $request->user();

        // 1. Kiểm tra có đăng nhập và có phải là Admin không
        if (!$admin || !($admin instanceof AdminAccount)) {
            return response()->json(['success' => false, 'message' => 'Truy cập bị từ chối. Bạn không phải là Quản trị viên.'], 403);
        }

        // 2. Kiểm tra xem Admin này có quyền thực hiện hành động này không
        if (!$admin->hasPermission($permission)) {
            return response()->json(['success' => false, 'message' => "Bạn không có quyền: {$permission}"], 403);
        }

        return $next($request);
    }
}
