import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import Tasks from '@/Pages/Tasks'; // Tasks bileşeni eklendi

export default function Dashboard({ tasks = [] }) {
    console.log("Dashboard received tasks:", tasks); // 🔥 Debug log

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <p className="mb-4">You're logged in!</p>

                            {/* 📝 Tasks.jsx bileşeni eklendi */}
                            <Tasks tasks={tasks} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
