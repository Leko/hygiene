import { combineParsers } from "@hygiene/core";
import { createCommand } from "./options";
import { plugins } from "./plugins";

const bodyParser = combineParsers(...plugins.map(({ parse }) => parse));

createCommand({ bodyParser, plugins }).parse();
