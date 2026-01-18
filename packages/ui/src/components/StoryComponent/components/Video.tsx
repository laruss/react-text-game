import { VideoComponent } from "@react-text-game/core/passages";
import { twMerge } from "tailwind-merge";

export type VideoProps = Readonly<{
    component: VideoComponent;
}>;

export const Video = ({ component: { props, content } }: VideoProps) => (
    <video
        id="video-content"
        className={twMerge("max-w-200 max-h-200 mx-auto", props?.className)}
        controls={props?.controls ?? false}
        autoPlay={props?.autoPlay ?? true}
        loop={props?.loop ?? true}
        muted={props?.muted ?? true}
    >
        <source src={content} />
        Your browser does not support the video tag.
    </video>
);
