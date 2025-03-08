import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import useDarkMode from '@/Theme/useDarkMode';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [theme, toggleTheme] = useDarkMode();
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className={`min-h-screen bg-gray-100 dark:bg-gray-900`}>
            <nav className="border-b border-gray-100 bg-white dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-white" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex dark:text-white">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    className='dark:text-white'
                                >
                                    Dashboard
                                </NavLink>
                            </div>
                        </div>

                        {/* Dark Mode Toggle */}
                        <div className="flex items-center space-x-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={theme === "dark"}
                                    onChange={toggleTheme}
                                    className="sr-only"
                                />
                                <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative transition">
                                    <div
                                        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                            theme === "dark" ? 'translate-x-6' : ''
                                        }`}
                                    />
                                    <span className="absolute left-1 top-1.5 text-xs text-gray-800 dark:text-white transition-transform duration-300">
                                        {/* {theme === "dark" ? '🌙' : '☀️'} */}
                                    </span>
                                </div>
                            </label>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white dark:bg-gray-700 px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-white transition duration-150 ease-in-out hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-700 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="text-gray-900 dark:text-white">{children}</main>
        </div>
    );
}
