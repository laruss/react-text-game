import { useState, useRef, useEffect } from "react";
import { HotspotFinderButton } from "@/components/hotspot-finder/HotspotFinderButton.tsx";

interface Hotspot {
    id: string;
    imageUrl: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    zoom: number;
}

export const HotspotFinder = () => {
    const [isFinderOpen, setIsFinderOpen] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [bgScale, setBgScale] = useState(1);
    const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
    const [hiddenInfoIds, setHiddenInfoIds] = useState<Set<string>>(new Set());

    const bgInputRef = useRef<HTMLInputElement>(null);
    const hotspotsInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const bgImageRef = useRef<HTMLImageElement>(null);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            if (backgroundImage) URL.revokeObjectURL(backgroundImage);
            hotspots.forEach(h => URL.revokeObjectURL(h.imageUrl));
        };
    }, []);

    const handleBackgroundSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (backgroundImage) URL.revokeObjectURL(backgroundImage);
            const url = URL.createObjectURL(file);
            setBackgroundImage(url);
        }
        e.target.value = '';
    };

    const handleHotspotsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newHotspots = files.map(file => ({
            id: `${Date.now()}-${Math.random()}`,
            imageUrl: URL.createObjectURL(file),
            x: 0,
            y: 0,
            zoom: 1.0,
        }));
        setHotspots(prev => [...prev, ...newHotspots]);
        e.target.value = '';
    };

    const handleRemoveAll = () => {
        if (backgroundImage) URL.revokeObjectURL(backgroundImage);
        hotspots.forEach(h => URL.revokeObjectURL(h.imageUrl));
        setBackgroundImage(null);
        setHotspots([]);
    };

    const handleMouseDown = (e: React.MouseEvent, hotspot: Hotspot) => {
        e.preventDefault();
        const img = bgImageRef.current;
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const hotspotX = (hotspot.x / 100) * rect.width;
        const hotspotY = (hotspot.y / 100) * rect.height;

        setSelectedHotspotId(hotspot.id);
        setDraggingId(hotspot.id);
        setDragOffset({
            x: e.clientX - rect.left - hotspotX,
            y: e.clientY - rect.top - hotspotY,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggingId) return;

        const img = bgImageRef.current;
        if (!img) return;

        const rect = img.getBoundingClientRect();
        const x = e.clientX - rect.left - dragOffset.x;
        const y = e.clientY - rect.top - dragOffset.y;

        const percentX = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const percentY = Math.max(0, Math.min(100, (y / rect.height) * 100));

        setHotspots(prev =>
            prev.map(h =>
                h.id === draggingId
                    ? { ...h, x: percentX, y: percentY }
                    : h
            )
        );
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    const copyCoordinates = (hotspot: Hotspot) => {
        const text = `{ x: ${hotspot.x.toFixed(2)}, y: ${hotspot.y.toFixed(2)} }`;
        navigator.clipboard.writeText(text);
    };

    const updateZoom = (id: string, zoom: number) => {
        setHotspots(prev =>
            prev.map(h =>
                h.id === id ? { ...h, zoom: Math.max(0.1, zoom) } : h
            )
        );
    };

    const toggleHotspotInfo = (id: string) => {
        setHiddenInfoIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const calculateBackgroundScale = () => {
        const img = bgImageRef.current;
        if (!img || !img.naturalWidth) return;

        const displayWidth = img.clientWidth;
        const naturalWidth = img.naturalWidth;
        const scale = displayWidth / naturalWidth;
        setBgScale(scale);
    };

    useEffect(() => {
        calculateBackgroundScale();
        window.addEventListener('resize', calculateBackgroundScale);
        return () => window.removeEventListener('resize', calculateBackgroundScale);
    }, [backgroundImage]);

    // Handle keyboard events for deleting selected hotspot
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Backspace' && selectedHotspotId) {
                e.preventDefault();
                const hotspot = hotspots.find(h => h.id === selectedHotspotId);
                if (hotspot) {
                    URL.revokeObjectURL(hotspot.imageUrl);
                }
                setHotspots(prev => prev.filter(h => h.id !== selectedHotspotId));
                setSelectedHotspotId(null);
            }
        };

        if (isFinderOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isFinderOpen, selectedHotspotId, hotspots]);

    if (!isFinderOpen) {
        return (
            <HotspotFinderButton onClick={() => setIsFinderOpen(true)} />
        );
    }

    return (
        <dialog open>
            <main className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white w-screen h-screen flex flex-col shadow-lg">
                    {/* Header with controls */}
                    <div className="flex gap-2 p-4 border-b border-gray-200">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                            onClick={() => bgInputRef.current?.click()}
                        >
                            Select Background Image
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
                            onClick={() => hotspotsInputRef.current?.click()}
                            disabled={!backgroundImage}
                        >
                            Select Hotspots Images
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                            onClick={handleRemoveAll}
                        >
                            Remove All
                        </button>
                        <button
                            className="ml-auto text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer px-4"
                            onClick={() => setIsFinderOpen(false)}
                        >
                            Close
                        </button>
                    </div>

                    {/* Hidden file inputs */}
                    <input
                        ref={bgInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBackgroundSelect}
                    />
                    <input
                        ref={hotspotsInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleHotspotsSelect}
                    />

                    {/* Main content area */}
                    <div className="flex-1 relative overflow-auto">
                        {backgroundImage ? (
                            <div
                                ref={containerRef}
                                className="w-full h-full relative flex items-center justify-center"
                                onMouseMove={handleMouseMove}
                                onMouseUp={handleMouseUp}
                                onMouseLeave={handleMouseUp}
                            >
                                <div className="relative inline-block">
                                    <img
                                        ref={bgImageRef}
                                        src={backgroundImage}
                                        alt="Background"
                                        className="max-w-full max-h-full object-contain block"
                                        style={{ maxHeight: 'calc(100vh - 64px - 2rem)' }}
                                        draggable={false}
                                        onLoad={calculateBackgroundScale}
                                    />

                                    {/* Hotspots overlay - positioned relative to the background image */}
                                    {hotspots.map(hotspot => {
                                        const actualScale = bgScale * hotspot.zoom;
                                        const isSelected = selectedHotspotId === hotspot.id;
                                        const isInfoHidden = hiddenInfoIds.has(hotspot.id);
                                        return (
                                            <div
                                                key={hotspot.id}
                                                className="absolute cursor-move"
                                                style={{
                                                    left: `${hotspot.x}%`,
                                                    top: `${hotspot.y}%`,
                                                    transform: `translate(-50%, -50%) scale(${actualScale})`,
                                                    outline: isSelected ? '3px solid #3B82F6' : 'none',
                                                    outlineOffset: '2px',
                                                }}
                                                onMouseDown={(e) => handleMouseDown(e, hotspot)}
                                            >
                                        <img
                                            src={hotspot.imageUrl}
                                            alt="Hotspot"
                                            className="pointer-events-none"
                                            draggable={false}
                                            style={{ width: 'auto', height: 'auto', maxWidth: 'none', maxHeight: 'none' }}
                                        />

                                        {/* Hotspot controls overlay */}
                                        {isInfoHidden ? (
                                            <button
                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white w-8 h-8 rounded-full shadow-lg pointer-events-auto hover:bg-blue-600 cursor-pointer flex items-center justify-center"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleHotspotInfo(hotspot.id);
                                                }}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                ⚙
                                            </button>
                                        ) : (
                                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 rounded p-2 shadow-lg pointer-events-auto flex flex-col gap-1 text-xs">
                                                <div className="flex justify-between items-center mb-1">
                                                    <div className="font-mono text-xs">
                                                        x: {hotspot.x.toFixed(2)}, y: {hotspot.y.toFixed(2)}
                                                    </div>
                                                    <button
                                                        className="text-gray-500 hover:text-gray-700 cursor-pointer ml-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleHotspotInfo(hotspot.id);
                                                        }}
                                                        onMouseDown={(e) => e.stopPropagation()}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyCoordinates(hotspot);
                                                    }}
                                                >
                                                    Copy Coordinates
                                                </button>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={hotspot.zoom}
                                                    className="border border-gray-300 rounded px-2 py-1 w-full"
                                                    onClick={(e) => e.stopPropagation()}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        if (!isNaN(val)) updateZoom(hotspot.id, val);
                                                    }}
                                                    onBlur={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        if (isNaN(val)) updateZoom(hotspot.id, 1.0);
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    );
                                })}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                                Select a background image to get started
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </dialog>
    );
};
