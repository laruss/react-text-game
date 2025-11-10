export const HotspotFinderButton = ({ onClick }: { onClick: VoidFunction }) => {
    return (
        <button
            className="fixed right-4 top-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer"
            onClick={onClick}
        >
            <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="#000"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 3v18m4-17-4 4-4-4m0 16 4-4 4 4M3 12h18M4 8l4 4-4 4m16 0-4-4 4-4"
                />
            </svg>
        </button>
    );
};
