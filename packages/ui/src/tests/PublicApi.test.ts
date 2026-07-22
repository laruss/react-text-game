import { describe, expect, test } from "bun:test";

import * as ui from "../index";

describe("UI public API", () => {
    test("exposes the documented runtime entry points", () => {
        expect(ui.GameProvider).toBeFunction();
        expect(ui.ErrorBoundary).toBeFunction();
        expect(ui.LanguageToggle).toBeFunction();
        expect(ui.PassageController).toBeFunction();
        expect(ui.SaveButton).toBeFunction();
        expect(ui.ReloadButton).toBeFunction();
        expect(ui.Button).toBeFunction();
        expect(ui.LoadingScreen).toBeFunction();
        expect(ui.RTGLogo).toBeFunction();
        expect(ui.RTGSplashScreen).toBeFunction();
        expect(ui.SplashScreenSequence).toBeFunction();
        expect(ui.useSaveLoadMenu).toBeFunction();
    });
});
