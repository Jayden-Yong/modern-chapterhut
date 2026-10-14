"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

function subscribe() {
    return () => {};
}

export default function ThemeToggle() {
    const mounted = useSyncExternalStore(
        subscribe,
        () => true,
        () => false,
    );
    const { resolvedTheme, setTheme } = useTheme();

    if (!mounted) {
        return <span className="inline-block h-6 w-6" />;
    }

    const isDark = resolvedTheme === "dark";

    const toggleTheme = () => {
        setTheme(isDark ? "light" : "dark");
    };

    return (
        <button
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full p-2 md:p-0 cursor-pointer text-muted hover:text-accent transition-all ease-in-out"
            onClick={toggleTheme}
        >
            {isDark ? <Sun /> : <Moon />}
        </button>
    );
}
