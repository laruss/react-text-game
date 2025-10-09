"use client";

import { useContext } from "react";

import { ComponentsContext } from "./ComponentsContext";

export const useComponents = () => {
    const components = useContext(ComponentsContext);
    if (!components) {
        throw new Error("useComponents must be used within ComponentsProvider");
    }

    return components;
};
