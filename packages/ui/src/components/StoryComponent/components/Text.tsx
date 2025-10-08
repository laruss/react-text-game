import { TextComponent } from "@react-text-game/core/passages";
import { twMerge } from "tailwind-merge";

type TextProps = Readonly<{
    component: TextComponent;
}>;

export const Text = ({ component: { props, content } }: TextProps) => (
    <div
        className={twMerge(
            "text-base text-justify whitespace-pre-wrap",
            props?.className
        )}
    >
        {content}
    </div>
);
