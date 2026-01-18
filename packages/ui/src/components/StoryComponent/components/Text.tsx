import { TextComponent } from "@react-text-game/core/passages";
import { twMerge } from "tailwind-merge";

export type TextProps = Readonly<{
    component: TextComponent;
}>;

export const Text = ({ component: { props, content } }: TextProps) => {
    const className = twMerge(
        "text-base text-justify whitespace-pre-wrap",
        props?.className
    );

    // HTML rendering path - browser handles parsing naturally
    if (props?.isHTML && typeof content === "string") {
        return (
            <div
                className={className}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }

    // Default: render as ReactNode
    return <div className={className}>{content}</div>;
};
