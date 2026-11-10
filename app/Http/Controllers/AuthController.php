<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(Request $request): Response
    {
        if (Auth::check()) {
            return Inertia::render('Admin/Dashboard');
        }

        if ($request->session()->get('admin_email_challenge.expires', 0) <= time()) {
            $request->session()->forget('admin_email_challenge');
        }

        return Inertia::render('Admin/Login', [
            'verifyCode' => $request->session()->has('admin_email_challenge'),
        ]);
    }

    public function login(Request $request)
    {
        if ($request->has('code')) {
            return $this->verifyCode($request);
        }

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'E-posta adresi gereklidir.',
            'password.required' => 'Şifre alanı boş bırakılamaz.',
        ]);

        if (Auth::validate($credentials)) {
            $user = Auth::guard()->getLastAttempted();
            $sendKey = 'admin-code-send:'.$user->getAuthIdentifier();
            if (RateLimiter::tooManyAttempts($sendKey, 3)) {
                throw ValidationException::withMessages(['email' => 'Çok fazla kod istendi. Birkaç dakika sonra tekrar deneyin.']);
            }
            RateLimiter::hit($sendKey, 300);

            $request->session()->forget('admin_email_challenge');
            $request->session()->regenerate();
            $code = (string) random_int(100000, 999999);

            try {
                if (! config('mail.mailers.contact.password')) {
                    throw new \RuntimeException('Admin email transport is not configured');
                }
                Mail::mailer('contact')->raw(
                    "ArdaCode yönetici giriş kodunuz: {$code}\n\nKod 5 dakika geçerlidir.",
                    fn ($email) => $email->from(config('mail.mailers.contact.username'), 'Arda Web Tasarım')
                        ->to('dersim3327@gmail.com')->subject('ArdaCode yönetici giriş kodu')
                );
            } catch (\Exception $exception) {
                \Illuminate\Support\Facades\Log::warning('Admin code email failed', ['type' => $exception::class]);
                throw ValidationException::withMessages(['email' => 'Giriş kodu gönderilemedi. Lütfen tekrar deneyin.']);
            }

            $request->session()->put('admin_email_challenge', [
                'id' => $user->getAuthIdentifier(),
                'hash' => Hash::make($code),
                'expires' => time() + 300,
                'remember' => $request->boolean('remember'),
            ]);

            return redirect()->route('login');
        }

        throw ValidationException::withMessages([
            'email' => 'Girdiğiniz kullanıcı bilgileri sistemimizle eşleşmiyor.',
        ]);
    }

    private function verifyCode(Request $request)
    {
        $code = $request->validate(['code' => 'required|digits:6'])['code'];
        $challenge = $request->session()->get('admin_email_challenge');
        if (! $challenge || $challenge['expires'] <= time()) {
            $request->session()->forget('admin_email_challenge');
            throw ValidationException::withMessages(['code' => 'Kodun süresi doldu. Şifrenizle yeniden giriş yapın.']);
        }

        $key = 'admin-code-check:'.$challenge['hash'];
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $request->session()->forget('admin_email_challenge');
            throw ValidationException::withMessages(['code' => 'Deneme sınırına ulaşıldı. Şifrenizle yeniden giriş yapın.']);
        }
        RateLimiter::hit($key, 300);

        if (! Hash::check((string) $code, $challenge['hash'])) {
            throw ValidationException::withMessages(['code' => 'Doğrulama kodu yanlış.']);
        }

        $request->session()->forget('admin_email_challenge');
        if (! \Illuminate\Support\Facades\Cache::add($key.':used', true, 300)) {
            throw ValidationException::withMessages(['code' => 'Kod kullanıldı. Şifrenizle yeniden giriş yapın.']);
        }
        if (! Auth::loginUsingId($challenge['id'], $challenge['remember'])) {
            return redirect()->route('login');
        }
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
