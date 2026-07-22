"use client";

import {
    type InteractiveMap,
    type Story,
    useCurrentPassage,
    type Widget,
} from "@react-text-game/core";

import { useComponents } from "#context/ComponentsContext/useComponents";

export const PassageController = () => {
    const [currentPassage, rerenderId] = useCurrentPassage();
    const {
        passages: {
            Empty: EmptyRenderer,
            InteractiveMap: InteractiveMapRenderer,
            Story: StoryRenderer,
            Unknown: UnknownRenderer,
            Widget: WidgetRenderer,
        },
    } = useComponents();

    if (!currentPassage) {
        return <EmptyRenderer />;
    }

    const renderComponent = () => {
        switch (currentPassage.type) {
            case "story":
                return <StoryRenderer story={currentPassage as Story} />;
            case "interactiveMap":
                return (
                    <InteractiveMapRenderer
                        interactiveMap={currentPassage as InteractiveMap}
                    />
                );
            case "widget":
                return <WidgetRenderer widget={currentPassage as Widget} />;
            default:
                return <UnknownRenderer passage={currentPassage} />;
        }
    };

    return (
        <div
            id="passage-content"
            key={`${currentPassage.type}-${rerenderId}`}
            className="w-full h-full animate-in fade-in duration-300"
        >
            {renderComponent()}
        </div>
    );
};
