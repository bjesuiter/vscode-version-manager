import {
  args,
  EarlyExitFlag,
  Flag,
  MAIN_COMMAND,
  PARSE_FAILURE,
  PartialOption,
  Text,
} from "../deps/_args.ts";
import { log } from "../deps/_log.std.ts";

function showHelp(cmdPath: readonly string[] = []) {
  if (!cmdPath.length) {
    log.info(`\nUSAGE: => TODO\n`);
  }
  log.info(`\n${parser.help(...cmdPath)}\n`);
}

const parser = args
  .describe(
    "Update a portable vscode install on Windows, extracted from a zip file",
  ).with(
    EarlyExitFlag("help", {
      describe: "Show help",
      exit() {
        showHelp();
        return Deno.exit();
      },
    }),
  ).with(
    Flag("safeExtract", {
      alias: ["s"],
      describe:
        "Do not override files while extracting the update-zip, if they exist already",
    }),
  ).with(PartialOption("installLocation", {
    type: Text,
    describe:
      "A path to the install location of the vscode instance, which should be updated",
    default: undefined,
  }));

/**
 * @param args should normally contain Deno.args, but can also contain mocked data for testing
 */
export function parseCliArgs(args: string[]) {
  const res = parser.parse(args);

  switch (res.tag as any) {
    case PARSE_FAILURE:
      console.error(res?.error?.toString());
      Deno.exit(1);
      break;
    case MAIN_COMMAND:
      console.log("no command", res.value);
      break;
    case "help":
      showHelp();
      break;
  }
}