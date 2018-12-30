#!/usr/bin/env node
import { createCommand } from "./options";
import { plugins } from "./plugins";

createCommand({ plugins }).parse();
