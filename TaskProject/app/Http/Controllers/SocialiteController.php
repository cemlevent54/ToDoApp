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

            $user = User::updateOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $googleUser->getName(),
                    'google_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt(str()->random(16)), // Rastgele şifre
                ]
            );

            Auth::login($user);

            // Pencere pop-up olarak açılmışsa, ana pencereye mesaj gönder ve kendini kapat
            return "<script>
                window.opener.postMessage('googleLoginSuccess', window.location.origin);
                window.close();
            </script>";

        } catch (\Exception $e) {
            return redirect('/login')->withErrors(['error' => 'Google girişinde hata oluştu.']);
        }
    }



}

