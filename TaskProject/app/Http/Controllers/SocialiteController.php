<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SocialiteController extends Controller
{
    /**
     * Google ile giriş için yönlendirme yap.
     */
    public function googleLogin()
    {
        return Socialite::driver('google')
                ->setScopes([
                    'openid',
                    'profile',
                    'email',
                    'https://www.googleapis.com/auth/calendar',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/calendar.events', 
                    'https://www.googleapis.com/auth/calendar.readonly' // 🔥 Eklenen yeni yetki
                ])
                ->with(['access_type' => 'offline', 'prompt' => 'consent']) // Kullanıcıya hesap seçim ekranını açtır
                ->redirect();

    }

    /**
     * Google'dan dönen kullanıcı bilgilerini işle.
     */
    public function googleAuthentication()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'google_token' => $googleUser->token,
                    'google_refresh_token' => $googleUser->refreshToken ?? null, // Refresh token'ı kaydet
                    'google_sync' => 1,
                ]
            );

            Auth::login($user);

            return "<script>
                window.opener.postMessage('googleLoginSuccess', window.location.origin);
                window.close();
            </script>";

        } catch (\Exception $e) {
            return redirect('/register')->withErrors(['error' => 'Google ile giriş başarısız oldu.']);
        }
    }

}
