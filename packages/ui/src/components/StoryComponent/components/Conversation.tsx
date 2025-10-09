"use client";

import {
    ConversationBubble,
    ConversationBubbleSide,
    ConversationComponent,
    ConversationVariant,
} from "@react-text-game/core/passages";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

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
                ? "bg-card text-card-foreground rounded-t-2xl rounded-br-2xl rounded-bl-lg border border-border"
                : "bg-primary-500 text-primary-foreground rounded-t-2xl rounded-bl-2xl rounded-br-lg"
        }`,
        avatar: `w-10 h-10 rounded-full overflow-hidden mb-1 ${side === "left" ? "order-first" : "order-last"}`,
    }),
} as const;

type ConversationLineProps = Readonly<{
    line: ConversationBubble;
    variant?: ConversationVariant | undefined;
    onClick?: () => void;
}>;

const ConversationLine = ({
    line,
    onClick,
    variant = "chat",
}: ConversationLineProps) => {
    const classNames = bubbleStyles[variant](line.side || "left");

    return (
        <div
            className={twMerge(classNames.base, line.props?.classNames?.base)}
            style={{ backgroundColor: line.color }}
            onClick={onClick}
        >
            <div
                className={twMerge(
                    classNames.avatar,
                    line.props?.classNames?.avatar
                )}
            >
                {line.who?.avatar ? (
                    <img
                        src={line.who.avatar}
                        alt={line.who.name || "Avatar"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-muted-300 text-muted-700 flex items-center justify-center cursor-default">
                        {line.who?.name?.[0] || "?"}
                    </div>
                )}
            </div>
            <div
                className={twMerge(
                    classNames.content,
                    line.props?.classNames?.content
                )}
            >
                {line.content}
            </div>
        </div>
    );
};

export type ConversationProps = Readonly<{
    component: ConversationComponent;
}>;

export const Conversation = ({ component }: ConversationProps) => {
    const [lines, setLines] = useState<Array<ConversationBubble>>([]);
    const { appearance, content, props } = component;

    useEffect(() => {
        if (appearance === "byClick") {
            // If the conversation is set to appear by click, we can initialize it with an empty array
            setLines([]);
        } else {
            // If it appears at once, we can set all lines immediately
            setLines(content);
        }
    }, [appearance, content]);

    const onClick = () => {
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
        // If the appearance is "atOnce", we do not need to handle clicks
    };

    return (
        <div className={props?.className}>
            {lines.map((line, index) => (
                <ConversationLine
                    key={index}
                    onClick={onClick}
                    line={line}
                    variant={props?.variant}
                />
            ))}
        </div>
    );
};
