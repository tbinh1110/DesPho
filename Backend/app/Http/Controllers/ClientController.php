<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\AiOperation;
use App\Models\CreditTransaction;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    public function profile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        return response()->json(['status' => 1, 'data' => $user]);
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:10240',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $file = $request->file('image');

        $path = $file->store('uploads', 'public');

        $image = Image::create([
            'user_id'   => $user->id,
            'image_url' => asset('storage/' . $path),
            'file_size' => $file->getSize(),
            'format'    => $file->extension(),
        ]);

        return response()->json(['status' => 1, 'message' => 'Upload thành công', 'data' => $image]);
    }

    public function processAi(Request $request)
    {
        $request->validate([
            'image_id'    => 'required|exists:images,id',
            'action'      => 'required|in:remove_bg,upscale,object_remove,magic_edit,filter,generate_video',
            'prompt'      => 'nullable|string',
            'filter_type' => 'nullable|string',
            'mask_image'  => 'nullable|file|mimes:jpeg,png,jpg',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();
        $cost = 10;

        if ($user->credits < $cost) {
            return response()->json(['status' => 0, 'message' => 'Không đủ Credits. Vui lòng nạp thêm.']);
        }

        $inputImage = Image::find($request->image_id);
        $relativePath = str_replace(asset('storage/'), '', $inputImage->image_url);
        $physicalPath = storage_path('app/public/' . ltrim($relativePath, '/'));

        if (!file_exists($physicalPath)) {
            return response()->json(['status' => 0, 'message' => 'Không tìm thấy file ảnh gốc.']);
        }

        // Bắn sang Python FastAPI Server
        $aiServerUrl = env('AI_SERVER_URL', 'http://127.0.0.1:8000') . '/process';
        $httpClient = Http::timeout(120)->attach('image', file_get_contents($physicalPath), basename($physicalPath));

        if ($request->hasFile('mask_image')) {
            $mask = $request->file('mask_image');
            $httpClient->attach('mask', file_get_contents($mask->getPathname()), $mask->getClientOriginalName());
        }

        try {
            /** @var \Illuminate\Http\Client\Response $response */
            $response = $httpClient->post($aiServerUrl, [
                'action'      => $request->action,
                'prompt'      => $request->prompt ?? '',
                'filter_type' => $request->filter_type ?? '',
            ]);

            if (!$response->successful()) {
                return response()->json(['status' => 0, 'message' => 'AI Server xử lý thất bại.']);
            }

            $ext = ($request->action === 'generate_video') ? 'mp4' : 'png';
            $savePath = 'uploads/ai_' . $request->action . '_' . time() . '.' . $ext;

            Storage::disk('public')->put($savePath, $response->body());

            // Lưu Database & Trừ tiền an toàn
            DB::beginTransaction();
            $user->decrement('credits', $cost);

            $outputImage = Image::create([
                'user_id'           => $user->id,
                'original_image_id' => $inputImage->id,
                'image_url'         => asset('storage/' . $savePath),
                'file_size'         => Storage::disk('public')->size($savePath),
                'format'            => $ext,
            ]);

            $operation = AiOperation::create([
                'user_id'         => $user->id,
                'provider_id'     => 1,
                'input_image_id'  => $inputImage->id,
                'output_image_id' => $outputImage->id,
                'operation_type'  => $request->action,
                'status'          => 'completed',
                'request_payload' => json_encode($request->only('action', 'prompt', 'filter_type')),
            ]);

            CreditTransaction::create([
                'user_id'      => $user->id,
                'operation_id' => $operation->id,
                'amount'       => $cost,
                'type'         => 'use',
            ]);
            DB::commit();

            return response()->json(['status' => 1, 'message' => 'Xử lý AI thành công!', 'data' => $outputImage]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => 0, 'message' => 'Lỗi kết nối AI Server: ' . $e->getMessage()]);
        }
    }

    public function getMyImages(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $images = Image::where('user_id', $user->id)
            ->whereNull('original_image_id')
            ->with('derivedImages')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json(['status' => 1, 'data' => $images]);
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'amount'         => 'required|numeric',
            'credits_added'  => 'required|integer',
            'payment_method' => 'required|string',
        ]);

        /** @var \App\Models\User $user */
        $user = $request->user();

        $payment = Payment::create([
            'user_id'        => $user->id,
            'amount'         => $request->amount,
            'credits_added'  => $request->credits_added,
            'payment_method' => $request->payment_method,
            'status'         => 'completed',
        ]);

        $user->increment('credits', $request->credits_added);

        CreditTransaction::create([
            'user_id' => $user->id,
            'amount'  => $request->credits_added,
            'type'    => 'add',
        ]);

        return response()->json(['status' => 1, 'message' => 'Nạp tiền thành công', 'data' => $payment]);
    }
    // Cập nhật thông tin cơ bản
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'full_name' => 'required|string|max:150',
            'phone_number' => 'nullable|string|max:20',
        ]);

        $user->update($data);
        return response()->json(['status' => 1, 'message' => 'Cập nhật thành công', 'data' => $user]);
    }

    // Đổi mật khẩu
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => ['required'],
            'new_password' => ['required', Password::min(6), 'confirmed'],
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['status' => 0, 'message' => 'Mật khẩu hiện tại không đúng.'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['status' => 1, 'message' => 'Đổi mật khẩu thành công.']);
    }
}
