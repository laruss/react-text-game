'use client';

import "@/game/registry";

import {
    PassageController,
    ReloadButton,
    SaveButton,
} from "@react-text-game/ui";
import { useGameIsStarted } from "@react-text-game/core";

export default function Home() {
    const isGameStarted = useGameIsStarted();

    return (
        <div className='w-screen h-screen flex flex-col'>
            {isGameStarted && (
                <>
                    <header className='fixed top-0 left-0 w-full h-16 bg-background flex items-center z-100'>
                        <SaveButton variant="ghost" isIconOnly />
                        <ReloadButton variant="ghost" isIconOnly />
                    </header>
                    <div className="h-16 w-full min-h-16" />
                </>
            )}
            <div className="w-full h-full">
                <PassageController />
            </div>
        </div>
    );
}
