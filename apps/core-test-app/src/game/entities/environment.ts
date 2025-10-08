import { BaseGameObject } from "@react-text-game/core";

type EnvironmentVariables = {
    dateTimestamp: number;
    temperature: number;
};

class Environment extends BaseGameObject<EnvironmentVariables> {
    get date(): Date {
        return new Date(this.variables.dateTimestamp);
    }

    set date(newDate: Date) {
        this.variables.dateTimestamp = newDate.getTime();
    }

    get temperature(): number {
        return this.variables.temperature;
    }

    set temperature(newTemp: number) {
        this.variables.temperature = newTemp;
    }

    spendTime({
        days = 0,
        hours = 0,
        minutes = 0,
    }: {
        days?: number;
        hours?: number;
        minutes?: number;
    }) {
        console.log(
            `Spending time: ${days} days, ${hours} hours, ${minutes} minutes`
        );
        // Now we can mutate the timestamp directly - valtio will track this change
        const currentDate = new Date(this.variables.dateTimestamp);
        currentDate.setDate(currentDate.getDate() + days);
        currentDate.setHours(currentDate.getHours() + hours);
        currentDate.setMinutes(currentDate.getMinutes() + minutes);

        // Assign the new timestamp - this is a primitive mutation that valtio tracks
        this.variables.dateTimestamp = currentDate.getTime();
    }

    changeTemperature(delta: number) {
        console.log(`Changing temperature by ${delta} degrees`);
        this.variables.temperature += delta;
    }
}

export const environment = new Environment({
    id: "environment",
    variables: {
        dateTimestamp: new Date().getTime(),
        temperature: 22,
    },
});
