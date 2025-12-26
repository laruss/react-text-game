import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GameProvider } from "@react-text-game/ui";
import { PropsWithChildren } from "react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "UI test app",
};

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <GameProvider
                    options={{
                        gameName: "ui-test-app",
                        isDevMode: true,
                        startPassage: "testMap",
                        translations: {
                            defaultLanguage: "en",
                            fallbackLanguage: "en",
                            resources: {
                                en: {
                                    passages: {},
                                },
                            },
                        },
                        initialState: {
                            environment: {
                                temperature: 25,
                            },
                            testMapEntity: {
                                isSecretHotspotDisplayed: true,
                            },
                        },
                    }}
                >
                    {children}
                </GameProvider>
            </body>
        </html>
    );
}
