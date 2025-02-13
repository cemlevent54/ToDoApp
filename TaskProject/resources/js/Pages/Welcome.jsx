import { Head, Link } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function Welcome({ auth }) {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setDarkMode(prefersDark);
    }, []);

    return (
        <>
            <Head title="Welcome" />
            <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} transition-all`}>
                {/* Navbar */}
                <header className="flex justify-between items-center px-8 py-6">
                    <h1 className="text-2xl font-bold">TaskMate</h1>
                    <nav className="space-x-4">
                        {auth.user ? (
                            <Link
                                href={route("dashboard")}
                                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route("login")}
                                    className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 transition text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 transition text-white"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="text-center py-20 px-6">
                    {auth.user ? (
                        <>
                            <h2 className="text-4xl font-extrabold mb-4 animate-fade-in">
                                Welcome Back, {auth.user.name}! 👋
                            </h2>
                            <p className="text-lg text-gray-400 max-w-3xl mx-auto animate-fade-in">
                                Click <strong className="text-blue-500">Dashboard</strong> to manage your tasks efficiently and stay productive!
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className="text-5xl font-extrabold mb-4 animate-fade-in">Organize Your Tasks Effortlessly</h2>
                            <p className="text-lg text-gray-400 max-w-3xl mx-auto animate-fade-in">
                                Manage your tasks, set priorities, and stay on track with our intuitive task manager.
                            </p>
                            <div className="mt-6 flex justify-center gap-4">
                                <Link
                                    href={route("login")}
                                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-lg rounded-lg shadow-lg transition-all"
                                >
                                    Get Started
                                </Link>
                                <Link
                                    href={route("register")}
                                    className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white text-lg rounded-lg shadow-lg transition-all"
                                >
                                    Create Account
                                </Link>
                            </div>
                        </>
                    )}
                </section>

                {/* Features Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-16">
                    <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">📝 Task Organization</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Create, edit, and organize your tasks efficiently with an intuitive interface.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">📅 Schedule & Prioritize</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Set deadlines, prioritize your tasks, and never miss an important task.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-semibold mb-2 text-gray-700 dark:text-gray-200">📊 Track Progress</h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            Stay on top of your tasks and measure your productivity over time.
                        </p>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center py-6 text-gray-500">
                    TaskMate - Stay Organized, Stay Productive 🚀
                </footer>
            </div>
        </>
    );
}
