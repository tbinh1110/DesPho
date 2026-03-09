<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Exception;

class AuthController extends Controller
{
    // 1. Đăng nhập truyền thống (Email/SĐT + Password)
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->login_id)
            ->orWhere('phone_number', $request->login_id)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['status' => 0, 'message' => 'Thông tin đăng nhập không chính xác.']);
        }

        return $this->respondWithToken($user, 'Đăng nhập thành công');
    }

    // 2. Xác thực OTP từ Firebase
    public function verifyOtpFirebase(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        try {
            // Xác thực token với Firebase Admin SDK
            $auth = Firebase::auth();
            $verifiedIdToken = $auth->verifyIdToken($request->token, false, 36000);
            $firebaseUid = $verifiedIdToken->claims()->get('sub');
            $firebaseUser = $auth->getUser($firebaseUid);
            $phone = $firebaseUser->phoneNumber;

            // Tìm hoặc tạo User mới dựa trên số điện thoại
            $user = User::firstOrCreate(
                ['phone_number' => $phone],
                [
                    'full_name' => 'User_' . Str::random(5),
                    'password'  => Hash::make(Str::random(16)),
                    'role'      => 'customer', // Mặc định là khách hàng
                    'credits'   => 0,
                ]
            );

            return $this->respondWithToken($user, 'Đăng nhập OTP thành công');
        } catch (Exception $e) {
            return response()->json(['status' => 0, 'message' => 'Lỗi xác thực Firebase: ' . $e->getMessage()], 401);
        }
    }

    // 3. Đăng nhập Google (Stateless)
    public function loginWithGoogle(Request $request)
    {
        $request->validate(['token' => 'required|string']);

        try {
            $provider = Socialite::driver('google');
            $googleUser = $provider->stateless()->userFromToken($request->token);

            $user = User::firstOrCreate(
                ['email' => $googleUser->email],
                [
                    'google_id' => $googleUser->id,
                    'full_name' => $googleUser->name,
                    'password'  => Hash::make(Str::random(16)),
                    'role'      => 'customer',
                    'credits'   => 0,
                ]
            );

            return $this->respondWithToken($user, 'Đăng nhập Google thành công');
        } catch (Exception $e) {
            return response()->json(['status' => 0, 'message' => 'Lỗi xác thực Google.']);
        }
    }

    // 4. Đăng xuất và xóa Token
    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        if ($user) {
            $user->currentAccessToken()->delete();
        }

        return response()->json(['status' => 1, 'message' => 'Đã đăng xuất thành công.']);
    }

    // Hàm bổ trợ trả về Token Sanctum
    protected function respondWithToken($user, $message)
    {
        return response()->json([
            'status'  => 1,
            'message' => $message,
            'token'   => $user->createToken('auth_token')->plainTextToken,
            'data'    => $user
        ]);
    }
}
