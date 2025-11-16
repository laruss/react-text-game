"use client";

import { PropsWithChildren, useCallback, useRef } from "react";

import {
    ConversationClickCallback,
    ConversationClickContext,
} from "./ConversationClickContext";

export const ConversationClickProvider = ({ children }: PropsWithChildren) => {
    const conversationsRef = useRef<Map<string, ConversationClickCallback>>(
        new Map()
    );

    const registerConversation = useCallback(
        (id: string, callback: ConversationClickCallback) => {
            conversationsRef.current.set(id, callback);
        },
        []
    );

    const unregisterConversation = useCallback((id: string) => {
        conversationsRef.current.delete(id);
    }, []);

    const notifyClick = useCallback(() => {
        // Call all registered conversation callbacks
        conversationsRef.current.forEach((callback) => {
            callback();
        });
    }, []);

    return (
        <ConversationClickContext.Provider
            value={{
                registerConversation,
                unregisterConversation,
                notifyClick,
            }}
        >
            {children}
        </ConversationClickContext.Provider>
    );
};
