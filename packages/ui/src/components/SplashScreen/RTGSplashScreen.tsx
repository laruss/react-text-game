import { RTGLogo } from "#components/Brand";

export const RTGSplashScreen = () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-black p-6 text-white">
        <RTGLogo className="h-24 w-24" title="React Text Game" />
        <p className="text-center text-sm font-medium tracking-[0.2em] uppercase">
            Powered by React Text Game
        </p>
    </div>
);
