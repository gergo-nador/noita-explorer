export function hiAgain(thing: string): string {
  return `Hi ${thing}!`;
}

export function test1(hello: string): string {
  return "oohhh" + hello;
}

import { helloAnything } from "@noita-explorer/model";

console.log(helloAnything("MMMMM"));
