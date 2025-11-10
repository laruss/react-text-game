import { useEffect, useCallback, useMemo } from "react";
import {
    ReactFlow,
    useNodesState,
    useEdgesState,
    Controls,
    Background,
    MiniMap,
    type Node,
    type Edge,
    type NodeChange,
} from "@xyflow/react";
import { usePassagesStore } from "@/app/usePassagesStore";
import { PassageNode } from "@/components/PassageNode";
import type { PassageExtendedMetadata } from "@/types";
import { HotspotFinder } from "@/components/hotspot-finder/HotspotFinder.tsx";

export const App = () => {
    const { data, loading, error, getPassages, updatePassagePosition } = usePassagesStore();
    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

    // Register custom node types
    const nodeTypes = useMemo(() => ({ passage: PassageNode }), []);

    // Fetch passages on mount
    useEffect(() => {
        getPassages();
    }, [getPassages]);

    // Handle node changes and save position updates to the backend
    const handleNodesChange = useCallback(
        (changes: NodeChange[]) => {
            // Apply changes to local state first
            onNodesChange(changes);

            // Filter for position changes where dragging has ended
            changes.forEach((change) => {
                if (
                    change.type === "position" &&
                    change.dragging === false &&
                    change.position
                ) {
                    // Save the new position via store action
                    updatePassagePosition(change.id, change.position);
                }
            });
        },
        [onNodesChange, updatePassagePosition]
    );

    // Transform passages metadata into ReactFlow nodes and edges
    useEffect(() => {
        if (!data) return;

        const startPassageId = data.settings?.startPassage;

        // Convert passages to nodes
        const passageNodes: Node[] = Object.values(data.passages).map(
            (passage: PassageExtendedMetadata) => ({
                id: passage.id,
                position: passage.position || { x: 0, y: 0 },
                data: {
                    label: passage.id,
                    description: passage.description,
                    tags: passage.tags,
                    source: passage.source,
                    isStartPassage: passage.id === startPassageId,
                },
                type: "passage",
            })
        );

        // Convert connections to edges
        const passageEdges: Edge[] = (data.connections || []).map(
            (connection, index) => ({
                id: `e-${connection.from}-${connection.to}-${index}`,
                source: connection.from,
                target: connection.to,
                animated: true,
            })
        );

        setNodes(passageNodes);
        setEdges(passageEdges);
    }, [data, setNodes, setEdges]);

    if (loading) {
        return (
            <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-xl">Loading passages...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center">
                <div className="text-xl text-danger-500">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-background text-foreground">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={handleNodesChange}
                onEdgesChange={onEdgesChange}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <HotspotFinder />
        </div>
    );
};
