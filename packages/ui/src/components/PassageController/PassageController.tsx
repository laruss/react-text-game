"use client";

import {
    InteractiveMap,
    Story,
    useCurrentPassage,
    Widget,
} from "@react-text-game/core";

import { InteractiveMapComponent } from "#components/InteractiveMapComponent";
import { StoryComponent } from "#components/StoryComponent";

export const PassageController = () => {
    const [currentPassage, rerenderId] = useCurrentPassage();

    const renderComponent = () => {
        switch (currentPassage?.type) {
            case "story":
                return <StoryComponent story={currentPassage as Story} />;
            case "interactiveMap":
                return (
                    <InteractiveMapComponent
                        interactiveMap={currentPassage as InteractiveMap}
                    />
                );
            case "widget":
                return (currentPassage as Widget).display();
            default:
                return <div>Unknown Passage Type {currentPassage?.type}</div>;
        }
    };

    if (!currentPassage) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <h1 className="text-2xl font-bold">NO PASSAGE SELECTED</h1>
            </div>
        );
    }

    return (
        <div
            key={`${currentPassage.type}-${rerenderId}`}
            className="w-full h-full animate-in fade-in duration-300"
        >
            {renderComponent()}
        </div>
    );
};
