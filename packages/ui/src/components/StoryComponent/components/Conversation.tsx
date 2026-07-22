// biome-ignore-all lint/suspicious/noArrayIndexKey: Conversation bubbles are ordered and have no stable identifier in the public model.
"use client";

import type {
    ConversationBubble,
    ConversationBubbleSide,
    ConversationComponent,
    ConversationVariant,
} from "@react-text-game/core/passages";
import {
    type KeyboardEvent as ReactKeyboardEvent,
    useCallback,
    useContext,
    useEffect,
    useId,
    useState,
} from "react";
import { twMerge } from "tailwind-merge";

import { ConversationClickContext } from "#context/ConversationClickContext";

const bubbleStyles = {
    chat: (side: ConversationBubbleSide) => ({
        base: `flex items-start gap-2 mb-3 ${side === "left" ? "justify-start" : "justify-end"}`,
        content: `max-w-[80%] px-4 py-2 rounded-2xl ${
            side === "left"
                ? "bg-muted-100 text-primary rounded-tl-sm"
                : "bg-secondary-600 text-secondary-foreground rounded-tr-sm"
        }`,
        avatar: `w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ${side === "left" ? "order-first" : "order-last"}`,
    }),
    messenger: (side: ConversationBubbleSide) => ({
        base: `flex items-end gap-2 my-4 ${side === "left" ? "justify-start" : "justify-end"}`,
        content: `max-w-[70%] px-4 py-3 shadow-sm ${
            side === "left"
                ? "bg-card text-card-foreground rounded-t-2xl rounded-br-2xl rounded-bl-lg border"
                : "bg-primary-500 text-primary-foreground rounded-t-2xl rounded-bl-2xl rounded-br-lg"
        }`,
        avatar: `w-10 h-10 rounded-full overflow-hidden mb-1 ${side === "left" ? "order-first" : "order-last"}`,
    }),
} as const;

type ConversationLineProps = Readonly<{
    line: ConversationBubble;
    variant?: ConversationVariant | undefined;
    onClick?: (() => void) | undefined;
}>;

const ConversationLine = ({
    line,
    onClick,
    variant = "chat",
}: ConversationLineProps) => {
    const classNames = bubbleStyles[variant](line.side || "left");
    const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (onClick && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onClick();
        }
    };

    return (
        <>
            {/* biome-ignore lint/a11y/noStaticElementInteractions: The container is interactive only when the optional button role and keyboard handler are present. */}
            <div
                id="conversation-line-container"
                className={twMerge(
                    classNames.base,
                    line.props?.classNames?.base
                )}
                onClick={onClick}
                onKeyDown={onClick ? handleKeyDown : undefined}
                role={onClick ? "button" : undefined}
                tabIndex={onClick ? 0 : undefined}
            >
                <div
                    id="conversation-line-avatar"
                    className={twMerge(
                        classNames.avatar,
                        line.props?.classNames?.avatar
                    )}
                >
                    {line.who?.avatar ? (
                        <img
                            id="conversation-line-avatar-img"
                            src={line.who.avatar}
                            alt={line.who.name || "Avatar"}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div
                            id="conversation-line-avatar-fallback"
                            className="w-full h-full bg-muted-300 text-muted-700 flex items-center justify-center cursor-default"
                        >
                            {line.who?.name?.[0] || "?"}
                        </div>
                    )}
                </div>
                <div
                    id="conversation-line-content"
                    className={twMerge(
                        classNames.content,
                        line.props?.classNames?.content
                    )}
                    style={{ backgroundColor: line.color }}
                >
                    {line.content}
                </div>
            </div>
        </>
    );
};

export type ConversationProps = Readonly<{
    component: ConversationComponent;
}>;

export const Conversation = ({ component }: ConversationProps) => {
    const [lines, setLines] = useState<Array<ConversationBubble>>([]);
    const { appearance, content, props } = component;
    const conversationId = useId();

    const context = useContext(ConversationClickContext);

    useEffect(() => {
        if (appearance === "byClick") {
            // Show first bubble immediately when using byClick
            const firstBubble = content[0];
            setLines(firstBubble ? [firstBubble] : []);
        } else {
            // If it appears at once, set all lines immediately
            setLines(content);
        }
    }, [appearance, content]);

    const showNext = useCallback(() => {
        if (appearance === "byClick") {
            // If the conversation is set to appear by click, append the next line
            setLines((prevLines) => {
                const nextLine = content[prevLines.length];
                if (nextLine) {
                    return [...prevLines, nextLine];
                }
                return prevLines; // No more lines to add
            });
        }
    }, [appearance, content]);

    // Register with context for byClick conversations
    useEffect(() => {
        if (appearance === "byClick" && context) {
            context.registerConversation(conversationId, showNext);
            return () => {
                context.unregisterConversation(conversationId);
            };
        }
    }, [appearance, context, conversationId, showNext]);

    const onClick = () => {
        if (appearance !== "byClick") return;

        if (context) {
            context.notifyClick();
        } else {
            showNext();
        }
    };

    return (
        <div id="conversation-content" className={props?.className}>
            {lines.map((line, index) => (
                <ConversationLine
                    key={index}
                    onClick={appearance === "byClick" ? onClick : undefined}
                    line={line}
                    variant={props?.variant}
                />
            ))}
        </div>
    );
};
