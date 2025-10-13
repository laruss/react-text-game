type IncludeProps = Readonly<{
    storyId: string;
}>;

/**
 * Component for including another story passage within the current one.
 *
 * @remarks
 * **WARNING: This is a compile-time-only component for MDX files.**
 * Do NOT use this component in regular React/TSX code. It only works in `.mdx` files
 * and is transformed at compile time into core game components. Using it in React components
 * will not work as expected.
 */
export const Include = (props: IncludeProps) => <>{props}</>;
