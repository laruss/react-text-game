"use client";

import {
    Game,
    NewOptions,
    newWidget,
    SYSTEM_PASSAGE_NAMES,
} from "@react-text-game/core";
import { PropsWithChildren, useEffect, useState } from "react";

import { ErrorBoundary } from "#components/ErrorBoundary";
import { MainMenu } from "#components/MainMenu";
import { SaveLoadModal } from "#components/SaveLoadModal";
import { Components, ComponentsProvider } from "#context/ComponentsContext";
import {
    SaveLoadMenuProvider,
    useSaveLoadMenu,
} from "#context/SaveLoadMenuContext";

import { DevModeDrawer } from "../DevModeDrawer";
import { AppIconMenu } from "./AppIconMenu";

export type GameProviderProps = PropsWithChildren<{
    options: NewOptions;
    components?: Components;
}>;

const SaveLoadModalWrapper = () => {
    const { isOpen, mode, close } = useSaveLoadMenu();
    return <SaveLoadModal isOpen={isOpen} onClose={close} mode={mode} />;
};

export const GameProvider = ({
    children,
    options,
    components = {},
}: GameProviderProps) => {
    const [internalOptions, setInternalOptions] = useState<NewOptions>(options);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        Game.init(options).then(() => {
            newWidget(
                SYSTEM_PASSAGE_NAMES.START_MENU,
                components?.MainMenu?.() || <MainMenu />
            );
            const initialPassage = options.startPassage || SYSTEM_PASSAGE_NAMES.START_MENU;
            Game.setCurrent(initialPassage);
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
        <ErrorBoundary>
            <ComponentsProvider components={components}>
                <SaveLoadMenuProvider>
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
                </SaveLoadMenuProvider>
            </ComponentsProvider>
        </ErrorBoundary>
    );
};
