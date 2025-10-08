import { Game } from "@react-text-game/core";
import { FormEvent, useState } from "react";

export const JumpToPassage = () => {
    const [passageToJumpTo, setPassageToJumpTo] = useState<string>("");

    const onJumpPassageSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (passageToJumpTo) {
            Game.jumpTo(passageToJumpTo);
            setPassageToJumpTo("");
        }
    };

    return (
        <div>
            <form onSubmit={onJumpPassageSubmit}>
                <label
                    htmlFor="jump-to-passage-id"
                    className="mr-2 text-card-foreground"
                >
                    Jump to passage ID:
                </label>
                <input
                    id="jump-to-passage-id"
                    type="text"
                    value={passageToJumpTo}
                    onChange={(e) =>
                        setPassageToJumpTo(
                            e.target.value
                        )
                    }
                    placeholder="Enter passage ID"
                    className="bg-muted/20 border border-input rounded px-2 text-sm text-foreground"
                />
                <button
                    type="submit"
                    disabled={!passageToJumpTo}
                    className="ml-2 bg-primary-500 text-primary-foreground px-2 rounded hover:bg-primary-600 transition-colors active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary-500 disabled:active:scale-100"
                >
                    Go
                </button>
            </form>
        </div>
    );
};
