<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        // Kiểm tra xem user có tồn tại và cột 'role' có khớp không
        if (!$user || $user->role !== $role) {
            return response()->json([
                'status' => 0,
                'message' => 'Truy cập bị từ chối. Sai quyền hạn.'
            ], 403);
        }

        return $next($request);
    }
}
