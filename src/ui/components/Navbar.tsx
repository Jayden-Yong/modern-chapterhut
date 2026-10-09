'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navlinks = [
        { name: "Home", href: "/" },
        { name: "Store", href: "/store" }
    ];

    const activePage = navlinks.find(link => pathname === link.href)?.name ?? '';

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border bg-surface text-accent font-lusitana shadow-sm">
            <div className="container mx-auto px-4 md:px-20">
                <div className="flex h-14 md:h-18 items-center justify-between">
                    {/* Brand - aligned left */}
                    <div className='flex space-x-2 items-center'>
                        <Image
                            src="/ChapterHut_transparent_new.png"
                            alt='ChapterHut logo'
                            width={60}
                            height={60}
                            className='hidden md:block'
                        />
                        <div className="shrink-0">
                            <Link
                                href="/store"
                                className="text-xl font-bold tracking-tight hover:text-accent transition-colors duration-200"
                            >
                                ChapterHut {(activePage === 'Home') ? '' : activePage}
                            </Link>
                        </div>
                    </div>

                    {/* Desktop Navigation - aligned right */}
                    <div className="hidden md:flex items-center space-x-6">
                        {navlinks.map((link) => {
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`text-base font-medium hover:text-accent transition-colors duration-200
                                        ${isActive ? 'bg-background/20 hover:text-accent font-bold' : 'text-muted hover:bg-background/20 hover:text-accent'}"`}
                                >
                                    {link.name}
                                </Link>
                            )
                        })}

                        <ThemeToggle />
                        <Link
                            href="/store"
                            className="inline-flex items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:bg-accent-hover transition-colors duration-200"
                        >
                            Cart (0)
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-muted hover:bg-background/20 hover:text-foreground focus:outline-none"
                            aria-controls="mobile-menu"
                            aria-expanded={isOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {!isOpen ? (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden border-t border-border bg-surface`} id="mobile-menu">
                <div className="space-y-1 px-4 py-3 sm:px-6">
                    {navlinks.map((link) => {
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className={`block rounded-md px-3 py-2 text-base font-medium transition-colors duration-200
                                    ${isActive ? 'bg-background/20 hover:text-accent font-semibold' : 'text-muted hover:bg-background/20 hover:text-accent'}`}
                            >
                                {link.name}
                            </Link>
                        )
                    })}

                    <div className="pt-2">
                        <Link
                            href="/store"
                            onClick={() => setIsOpen(false)}
                            className="block w-full text-center rounded-md bg-accent px-4 py-2.5 text-base font-medium text-background hover:bg-accent-hover transition-colors duration-200"
                        >
                            Cart (0)
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}