import { describe, expect, test } from "bun:test";
import { Fragment, isValidElement, type ReactElement } from "react";

import * as publicApi from "#index";

function expectPropsWrapper(
    element: ReactElement,
    expectedProps: Record<string, unknown>
) {
    expect(isValidElement<{ children: unknown }>(element)).toBe(true);
    expect(element.type).toBe(Fragment);
    expect(
        (element as ReactElement<{ children: unknown }>).props.children
    ).toBe(expectedProps);
}

describe("public component entry", () => {
    test("exports every compile-time component", () => {
        expect(Object.keys(publicApi).sort()).toEqual([
            "Action",
            "Actions",
            "Conversation",
            "Include",
            "Say",
            "Var",
        ]);
    });

    test("Action preserves the complete compile-time props object", () => {
        const onPerform = () => undefined;
        const props = {
            children: "Open the door",
            onPerform,
            color: "primary" as const,
            isDisabled: false,
        };

        expectPropsWrapper(publicApi.Action(props), props);
    });

    test("Actions preserves its child component and layout props", () => {
        const props = {
            children: publicApi.Action,
            direction: "vertical" as const,
            className: "choices",
        };

        expectPropsWrapper(publicApi.Actions(props), props);
    });

    test("Say preserves speaker and presentation props", () => {
        const props = {
            children: "Welcome!",
            who: { name: "Guide", avatar: "/guide.png" },
            side: "left" as const,
            color: "#ff00aa" as const,
            classNames: { base: "bubble" },
        };

        expectPropsWrapper(publicApi.Say(props), props);
    });

    test("Conversation preserves its child component and display props", () => {
        const props = {
            children: publicApi.Say,
            appearance: "byClick" as const,
            variant: "messenger" as const,
            className: "dialogue",
        };

        expectPropsWrapper(publicApi.Conversation(props), props);
    });

    test("Include preserves the referenced story id", () => {
        const props = { storyId: "shared-intro" };

        expectPropsWrapper(publicApi.Include(props), props);
    });

    test("Var exposes its child as fragment content", () => {
        const child = <strong>42</strong>;
        const element = publicApi.Var({ children: child });

        expect(element.type).toBe(Fragment);
        expect(element.props.children).toBe(child);
    });
});
