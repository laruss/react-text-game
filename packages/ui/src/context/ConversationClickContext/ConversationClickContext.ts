"use client";

import { createContext } from "react";

export type ConversationClickCallback = () => void;

export interface ConversationClickContextType {
    registerConversation: (
        id: string,
        callback: ConversationClickCallback
    ) => void;
    unregisterConversation: (id: string) => void;
    notifyClick: () => void;
}

export const ConversationClickContext = createContext<
    ConversationClickContextType | undefined
>(undefined);
