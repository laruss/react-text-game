#!/usr/bin/env node

import "#cli/commands/init";
import "#cli/commands/scan";
import "#cli/commands/start";

import program from "#cli/program";

program.parse(process.argv);
