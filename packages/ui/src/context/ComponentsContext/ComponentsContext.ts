"use client";

import { createContext } from "react";

import type { RequiredComponents } from "./types";

export const ComponentsContext = createContext<RequiredComponents | undefined>(
    undefined
);
