import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { PassagesMetadata } from "@/types";
import { apiGet, apiPatch } from "./api";

type PassageState = {
    data: PassagesMetadata | null;
    loading: boolean;
    error: string | null;
    getPassages: () => Promise<void>;
    updatePassagePosition: (passageId: string, position: { x: number; y: number }) => Promise<void>;
};

export const usePassagesStore = create<PassageState>()(
    devtools(
        persist(
            (set, get) => ({
                data: null,
                loading: false,
                error: null,

                getPassages: async () => {
                    set({ loading: true, error: null });
                    try {
                        const data = await apiGet<PassagesMetadata>("/api/passages");
                        set({ data, loading: false });
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : String(error);
                        set({ error: errorMessage, loading: false });
                    }
                },

                updatePassagePosition: async (passageId: string, position: { x: number; y: number }) => {
                    try {
                        await apiPatch(`/api/passages/${passageId}/position`, position);

                        // Update local state optimistically
                        const currentData = get().data;
                        if (currentData?.passages[passageId]) {
                            set({
                                data: {
                                    ...currentData,
                                    passages: {
                                        ...currentData.passages,
                                        [passageId]: {
                                            ...currentData.passages[passageId],
                                            position,
                                        },
                                    },
                                },
                            });
                        }
                    } catch (error) {
                        console.error(`Failed to update position for passage ${passageId}:`, error);
                    }
                },
            }),
            {
                name: "passages-store",
            }
        ),
        {
            name: "passages-store",
        },
    )
);
