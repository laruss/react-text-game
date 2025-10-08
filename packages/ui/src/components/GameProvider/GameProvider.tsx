'use client';

import {
    Game,
    NewOptions,
    newWidget,
    SYSTEM_PASSAGE_NAMES,
} from "@react-text-game/core";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";

import { ErrorBoundary } from "#components/ErrorBoundary";
import { MainMenu } from "#components/MainMenu";
import { SaveLoadModal } from "#components/SaveLoadModal";
import { useSaveLoadMenu } from "#hooks";

import { DevModeDrawer } from "../DevModeDrawer";
import { AppIconMenu } from "./AppIconMenu";
import { SaveLoadMenuProvider } from "./SaveLoadMenuProvider";

type Components = Readonly<{
    MainMenu?: (() => ReactNode) | undefined;
}>;

type GameProviderProps = PropsWithChildren<{
    options: NewOptions;
    components?: Components;
}>;

const SaveLoadModalWrapper = () => {
    const { isOpen, mode, close } = useSaveLoadMenu();
    return <SaveLoadModal isOpen={isOpen} onClose={close} mode={mode} />;
};

export const GameProvider = ({ children, options, components }: GameProviderProps) => {
    const [internalOptions, setInternalOptions] = useState<NewOptions>(options);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        Game.init(options).then(() => {
            newWidget(SYSTEM_PASSAGE_NAMES.START_MENU, components?.MainMenu?.() || <MainMenu />);
            Game.setCurrent(SYSTEM_PASSAGE_NAMES.START_MENU);
            setIsInitialized(true);
        });
    }, [options]);

    useEffect(() => {
        if (internalOptions && isInitialized && internalOptions !== options) {
            Game.updateOptions(internalOptions);
        }
    }, [internalOptions, isInitialized, options]);

    if (!isInitialized) {
        return null;
    }

    return (
        <SaveLoadMenuProvider>
            <ErrorBoundary>
                {children}
                {options.isDevMode && (
                    <>
                        <AppIconMenu
                            options={internalOptions}
                            setOptions={setInternalOptions}
                        />
                        <DevModeDrawer options={internalOptions} />
                    </>
                )}
                <SaveLoadModalWrapper />
            </ErrorBoundary>
        </SaveLoadMenuProvider>
    );
};
