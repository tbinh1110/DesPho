<?php

namespace App\Http\Controllers;

use App\Models\AdminAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    /* ====================================================
       PHẦN 1: QUẢN LÝ ADMIN (TÀI KHOẢN QUẢN TRỊ)
    ==================================================== */
    public function getDataAdmin()
    {
        return response()->json(['data' => AdminAccount::get()]);
    }

    public function createAdmin(Request $request)
    {
        AdminAccount::create([
            'role_id'      => $request->role_id ?? 1,
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'full_name'    => $request->full_name,
            'phone_number' => $request->phone_number,
        ]);
        return response()->json([
            'status'  => true,
            'message' => "Đã thêm Quản trị viên thành công.",
        ]);
    }

    public function updateAdmin(Request $request)
    {
        $admin = AdminAccount::find($request->id);
        if ($admin) {
            $admin->update([
                'role_id'      => $request->role_id,
                'email'        => $request->email,
                'full_name'    => $request->full_name,
                'phone_number' => $request->phone_number,
                // Nếu có gửi password mới thì cập nhật, không thì giữ nguyên
                'password'     => $request->password ? Hash::make($request->password) : $admin->password,
            ]);
        }
        return response()->json([
            'status'  => true,
            'message' => "Đã cập nhật Quản trị viên thành công.",
        ]);
    }

    public function deleteAdmin(Request $request)
    {
        AdminAccount::find($request->id)->delete();
        return response()->json([
            'status'  => true,
            'message' => "Đã xóa Quản trị viên thành công.",
        ]);
    }


    /* ====================================================
       PHẦN 2: QUẢN LÝ CUSTOMER (KHÁCH HÀNG)
    ==================================================== */
    public function getDataCustomer()
    {
        return response()->json(['data' => User::get()]);
    }

    public function createCustomer(Request $request)
    {
        User::create([
            'email'        => $request->email,
            'password'     => Hash::make($request->password),
            'full_name'    => $request->full_name,
            'phone_number' => $request->phone_number,
            'credits'      => $request->credits ?? 0,
        ]);
        return response()->json([
            'status'  => true,
            'message' => "Đã thêm Khách hàng thành công.",
        ]);
    }

    public function updateCustomer(Request $request)
    {
        $customer = User::find($request->id);
        if ($customer) {
            $customer->update([
                'email'        => $request->email,
                'full_name'    => $request->full_name,
                'phone_number' => $request->phone_number,
                'credits'      => $request->credits,
                'password'     => $request->password ? Hash::make($request->password) : $customer->password,
            ]);
        }
        return response()->json([
            'status'  => true,
            'message' => "Đã cập nhật Khách hàng thành công.",
        ]);
    }

    public function deleteCustomer(Request $request)
    {
        User::find($request->id)->delete();
        return response()->json([
            'status'  => true,
            'message' => "Đã xóa Khách hàng thành công.",
        ]);
    }

    // Tính năng cộng tiền nhanh cho Customer
    public function addCredits(Request $request)
    {
        $customer = User::find($request->user_id);
        if ($customer) {
            $customer->increment('credits', $request->amount);
            return response()->json(['status' => true, 'message' => "Đã cộng tiền thành công."]);
        }
        return response()->json(['status' => false, 'message' => "Khách hàng không tồn tại."]);
    }


    /* ====================================================
       PHẦN 3: ĐĂNG NHẬP / ĐĂNG XUẤT ADMIN
    ==================================================== */
    public function login(Request $request)
    {
        $admin = AdminAccount::where('email', $request->email)->first();

        if ($admin && Hash::check($request->password, $admin->password)) {
            return response()->json([
                'status'  => 1,
                'message' => "Đã đăng nhập thành công.",
                'token'   => $admin->createToken('admin_token')->plainTextToken,
                'data'    => $admin
            ]);
        } else {
            return response()->json([
                'status'  => 0,
                'message' => "Tài khoản hoặc mật khẩu không chính xác.",
            ]);
        }
    }

   public function logout(Request $request)
    {
        /** @var \App\Models\AdminAccount $admin */
        $admin = $request->user();

        if ($admin && $admin->currentAccessToken()) {
            $admin->currentAccessToken()->delete();
        }

        return response()->json(['success' => true, 'message' => 'Đã đăng xuất Admin.']);
    }
}
