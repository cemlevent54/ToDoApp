<?php

namespace App\Services;

use Google\Client as Google_Client;
use Google\Service\Calendar as Google_Service_Calendar;
use Google\Service\Calendar\Event as Google_Service_Calendar_Event;
use Google\Service\Calendar\EventDateTime as Google_Service_Calendar_EventDateTime;
use Carbon\Carbon;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;

class CalendarService
{
    private function isSyncEnabled()
    {
        $user = Auth::user();
        return $user && $user->google_sync;
    }

    private function getClient()
    {
        $user = Auth::user();
        if (!$user || !$user->google_token || !$user->google_refresh_token) {
            return null;
        }

        $client = new Google_Client();
        $client->setAccessToken($user->google_token);

        if ($client->isAccessTokenExpired()) {
            $newToken = $client->fetchAccessTokenWithRefreshToken($user->google_refresh_token);

            if (isset($newToken['access_token'])) {
                $user->update([
                    'google_token' => $newToken['access_token'],
                    'google_refresh_token' => $newToken['refresh_token'] ?? $user->google_refresh_token,
                ]);
            }
        }

        return new Google_Service_Calendar($client);
    }

    /**
     * ✅ Google Calendar'a görev ekler.
     */
    public function addTaskToCalendar(Task $task)
    {
        if (!$this->isSyncEnabled()) return;
        $service = $this->getClient();
        if (!$service) return;

        $event = new Google_Service_Calendar_Event();
        $event->setSummary($task->title);

        // 📅 Başlangıç ve Bitiş Tarihlerini Ayarla
        $start = new Google_Service_Calendar_EventDateTime();
        $start->setDateTime(Carbon::parse($task->start_date ?? now())->setTimezone('Europe/Istanbul')->toRfc3339String());
        $start->setTimeZone('Europe/Istanbul');
        $event->setStart($start);

        $end = new Google_Service_Calendar_EventDateTime();
        $end->setDateTime(Carbon::parse($task->end_date ?? now()->addHour())->setTimezone('Europe/Istanbul')->toRfc3339String());
        $end->setTimeZone('Europe/Istanbul');
        $event->setEnd($end);

        // 📌 Google Calendar'a ekle ve event ID'yi kaydet
        $event = $service->events->insert('primary', $event);
        $task->update(['google_event_id' => $event->getId()]);
    }

    /**
     * ✅ Google Calendar'daki bir etkinliği günceller.
     */
    public function updateTaskInCalendar(Task $task)
    {
        if (!$this->isSyncEnabled() || !$task->google_event_id) {
            return;
        }

        $service = $this->getClient();
        if (!$service) {
            return;
        }

        $event = $service->events->get('primary', $task->google_event_id);
        if ($event) {
            $event->setSummary($task->title);

            $start = new Google_Service_Calendar_EventDateTime();
            $start->setDateTime(Carbon::parse($task->start_date ?? now())->setTimezone('Europe/Istanbul')->toRfc3339String());
            $start->setTimeZone('Europe/Istanbul');
            $event->setStart($start);

            $end = new Google_Service_Calendar_EventDateTime();
            $end->setDateTime(Carbon::parse($task->end_date ?? now()->addHour())->setTimezone('Europe/Istanbul')->toRfc3339String());
            $end->setTimeZone('Europe/Istanbul');
            $event->setEnd($end);

            $service->events->update('primary', $task->google_event_id, $event);
        }
    }

    /**
     * ✅ Google Calendar'daki bir etkinliği siler.
     */
    public function deleteTaskFromCalendar(Task $task)
    {
        if (!$this->isSyncEnabled() || !$task->google_event_id) {
            return;
        }

        $service = $this->getClient();
        if (!$service) {
            return;
        }

        $service->events->delete('primary', $task->google_event_id);

        // 🗑️ Google Event ID'yi temizle
        $task->update(['google_event_id' => null]);
    }

    /**
     * ✅ Google Calendar'dan etkinlikleri alarak sistemdeki görevlerle senkronize eder.
     */
    public function syncTasksFromGoogleCalendar()
    {
        if (!$this->isSyncEnabled()) {
            return;
        }

        $service = $this->getClient();
        if (!$service) {
            return;
        }

        // 📅 Son 30 gün ve gelecek 30 günü kapsayacak şekilde zaman aralığını belirle
        $timeMin = Carbon::now()->subDays(30)->toRfc3339String();
        $timeMax = Carbon::now()->addDays(30)->toRfc3339String();

        try {
            $events = $service->events->listEvents('primary', [
                'timeMin' => $timeMin,
                'timeMax' => $timeMax,
                'orderBy' => 'startTime',
                'singleEvents' => true,
            ]);

            foreach ($events->getItems() as $event) {
                $this->syncEvent($event);
            }
        } catch (\Exception $e) {
            // Log::error("Google Calendar Sync Hatası: " . $e->getMessage());
        }
    }

    /**
     * ✅ Google'dan gelen tek bir etkinliği veritabanı ile senkronize eder.
     */
    private function syncEvent($event)
    {
        $user = Auth::user();
        if (!$user) {
            return;
        }

        // 📌 Sadece "Görev (Task)" olarak işaretlenen etkinlikleri al
        if (!$event->getSummary() || $event->getSummary() === "") {
            return;
        }

        $existingTask = Task::where('google_event_id', $event->getId())->first();

        if ($existingTask) {
            // 📝 **Görevi Güncelle**
            $existingTask->update([
                'title' => $event->getSummary(),
                'start_date' => Carbon::parse($event->getStart()->getDateTime(), 'UTC')->setTimezone('Europe/Istanbul')->toDateTimeString(),
                'end_date' => Carbon::parse($event->getEnd()->getDateTime(), 'UTC')->setTimezone('Europe/Istanbul')->toDateTimeString(),
            ]);
        } else {
            // ➕ **Yeni Görev Oluştur**
            Task::create([
                'title' => $event->getSummary(),
                'start_date' => Carbon::parse($event->getStart()->getDateTime(), 'UTC')->setTimezone('Europe/Istanbul')->toDateTimeString(),
                'end_date' => Carbon::parse($event->getEnd()->getDateTime(), 'UTC')->setTimezone('Europe/Istanbul')->toDateTimeString(),
                'status' => 0, // Varsayılan olarak "pending"
                'user_id' => $user->id,
                'google_event_id' => $event->getId(),
            ]);
        }
    }
}
