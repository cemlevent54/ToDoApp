<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class SocialiteController extends Controller
{
    public function googleLogin()
    {
        return Socialite::driver('google')
            ->setScopes(['openid', 'profile', 'email']) // `scopes()` yerine `setScopes()` kullan
            ->with(['prompt' => 'select_account']) // Kullanıcıya hesap seçim ekranını açtır
            ->redirect();
    }




    public function googleAuthentication()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();

            // Kullanıcıyı e-posta adresine göre kontrol et
            $user = User::where('email', $googleUser->getEmail())->first();

            if (!$user) {
                // Kullanıcı yoksa yeni bir hesap oluştur
                $user = User::create([
                    'name' => $googleUser->getName(),
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(str()->random(16)), // Rastgele şifre oluştur
                ]);
            }

            // Kullanıcıyı oturum açtır
            Auth::login($user);

            // Frontend'e mesaj gönder ve pop-up'ı kapat
            return "<script>
                window.opener.postMessage('googleLoginSuccess', window.location.origin);
                window.close();
            </script>";
        } catch (\Exception $e) {
            return redirect('/register')->withErrors(['error' => 'Google ile kayıt başarısız.']);
        }
    }




}

