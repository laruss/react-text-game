import type { Component } from "react";

export const MdxImage = ({ src }: { src: string }) =>
    ({
        type: "image",
        content: src,
    }) as unknown as Component;
