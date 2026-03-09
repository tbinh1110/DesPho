<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class Recaptcha implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret'   => env('RECAPTCHA_SECRET_KEY'),
            'response' => $value,
        ]);
        if ($response instanceof Response) {
            $data = $response->json();

            if (!isset($data['success']) || $data['success'] !== true) {
                $fail('Xác thực reCAPTCHA không thành công.');
            }
        } else {
            $fail('Không thể kết nối với dịch vụ xác thực.');
        }
    }
}
