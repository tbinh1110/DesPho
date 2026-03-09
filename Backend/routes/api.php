<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClientController;

Route::options('{any}', function () {
    return response()->json([], 200);
})->where('any', '.*');

// =============================================
// API CÔNG KHAI (AUTH)
// =============================================
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/google', [AuthController::class, 'loginWithGoogle']);

    // Firebase OTP Routes
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp-firebase', [AuthController::class, 'verifyOtpFirebase']);
});

// =============================================
// API DÀNH CHO KHÁCH HÀNG (YÊU CẦU ĐĂNG NHẬP)
// =============================================
Route::middleware(['auth:sanctum', 'role:customer'])->prefix('client')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    // Quản lý thông tin cá nhân
    Route::get('/profile', [ClientController::class, 'profile']);
    Route::post('/update-profile', [ClientController::class, 'updateProfile']);
    Route::post('/change-password', [ClientController::class, 'changePassword']);

    // Quản lý hình ảnh và xử lý AI
    Route::get('/images', [ClientController::class, 'getMyImages']);
    Route::post('/images/upload', [ClientController::class, 'uploadImage']);
    Route::post('/ai/process', [ClientController::class, 'processAi']);

    // Thanh toán và Credits
    Route::post('/payment/create', [ClientController::class, 'createPayment']);
});

// =============================================
// API ADMIN
// =============================================
Route::prefix('admin')->group(function () {
    Route::post('/login', [AdminController::class, 'login']);

    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('/logout', [AdminController::class, 'logout']);

        // Quản lý Credits & Quản trị viên
        Route::post('/credits/add', [AdminController::class, 'addCredits'])->middleware('permission:manage_credits');
        Route::get('/accounts/data', [AdminController::class, 'getDataAdmin'])->middleware('permission:view_admins');
        Route::post('/accounts/create', [AdminController::class, 'createAdmin'])->middleware('permission:create_admin');
        Route::post('/accounts/update', [AdminController::class, 'updateAdmin'])->middleware('permission:edit_admin');
        Route::post('/accounts/delete', [AdminController::class, 'deleteAdmin'])->middleware('permission:delete_admin');

        // Quản lý Khách hàng
        Route::get('/customers/data', [AdminController::class, 'getDataCustomer'])->middleware('permission:view_customers');
        Route::post('/customers/create', [AdminController::class, 'createCustomer'])->middleware('permission:create_customer');
        Route::post('/customers/update', [AdminController::class, 'updateCustomer'])->middleware('permission:edit_customer');
        Route::post('/customers/delete', [AdminController::class, 'deleteCustomer'])->middleware('permission:delete_customer');
    });
});
