import { createContext } from "react";

import { RequiredComponents } from "./types";

export const ComponentsContext = createContext<RequiredComponents | undefined>(
    undefined
);
