import { PassageController } from "@react-text-game/ui";

import { GameHeader } from "@/components/GameHeader";

export const App = () => {
    return (
        <div className="relative flex flex-col h-screen w-screen bg-background text-foreground overflow-hidden">
            <GameHeader />
            <div className="flex-1 h-full overflow-auto">
                <PassageController />
            </div>
        </div>
    );
};
