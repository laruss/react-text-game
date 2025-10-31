import { memo } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";

export type PassageNodeData = {
    label: string;
    description?: string;
    tags?: string[];
    source: "code" | "tool";
    isStartPassage?: boolean;
};

export const PassageNode = memo((props: NodeProps<Node<PassageNodeData>>) => {
    const { data } = props;

    return (
        <div className="px-4 py-2 shadow-md rounded-md bg-card border-2 border-border min-w-[150px]">
            <Handle type="target" position={Position.Top} className="w-3 h-3" />

            <div className="flex items-center gap-2">
                {data.isStartPassage && (
                    <img
                        src="/rocket.svg"
                        alt="Start passage"
                        className="w-5 h-5"
                        title="Start passage"
                    />
                )}
                <div className="font-semibold text-foreground">{data.label}</div>
            </div>

            {data.description && (
                <div className="text-xs text-muted-foreground mt-1">
                    {data.description}
                </div>
            )}

            {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                    {data.tags.map((tag) => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-0.5 rounded bg-primary-100 text-primary-700"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
        </div>
    );
});

PassageNode.displayName = "PassageNode";
