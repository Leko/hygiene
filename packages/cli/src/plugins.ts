import { Plugin } from "@hygiene/core";
import addonGithubUrl from "@hygiene/plugin-github-url";

export const plugins: Plugin<any, any>[] = [addonGithubUrl()];
