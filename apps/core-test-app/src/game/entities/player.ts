import { createEntity } from "@react-text-game/core";

export const player = createEntity('player', {
    name: 'John',
    surname: 'Doe',
    age: 30,
    inventory: {
        money: 100,
        items: [] as Array<string>,
    },
});
