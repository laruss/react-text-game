import { PassageController } from "@react-text-game/ui";

// @ts-expect-error TS2307 // fixme
import Test from '@/game/stories/mdx-test.mdx';

export const App = () => {
    console.log(Test);

    return <PassageController />;
};
