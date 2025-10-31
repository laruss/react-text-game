import { Command } from "commander";

const program = new Command();

program
    .name("game-observer")
    .description("CLI for Game Observer utilities")
    .version("0.1.0");

export default program;
