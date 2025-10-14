import { useContext } from "react";

import { ConversationClickContext } from "./ConversationClickContext";

export const useConversationClickContext = () => {
    const context = useContext(ConversationClickContext);

    if (!context) {
        throw new Error(
            "useConversationClickContext must be used within ConversationClickProvider"
        );
    }

    return context;
};
