import { assertStrictEquals } from "../deps.ts";
import { Utf16 } from "../../mod.ts";

if (!globalThis.ReadableStream) {
  const nodeUrl = "node:stream/web";
  const nsw = await import(nodeUrl);
  globalThis.ReadableStream = nsw.ReadableStream;
  globalThis.WritableStream = nsw.WritableStream;
}

Deno.test("Utf16.Be.EncoderStream.prototype.encoding", () => {
  const encoder = new Utf16.Be.EncoderStream();
  assertStrictEquals(encoder.encoding, "utf-16be");
});

Deno.test("Utf16.Be.EncoderStream.prototype.fatal", () => {
  const encoder1 = new Utf16.Be.EncoderStream({ fatal: true });
  assertStrictEquals(encoder1.fatal, true);

  const encoder2 = new Utf16.Be.EncoderStream({ fatal: false });
  assertStrictEquals(encoder2.fatal, false);

  const encoder3 = new Utf16.Be.EncoderStream();
  assertStrictEquals(encoder3.fatal, false);
});

Deno.test("Utf16.Be.EncoderStream.prototype.writable", async () => {
  const td = [
    "ABC",
    "あ",
    "\uD867",
    "",
    "A",

    "\uD867\uDE3E",
    "A",
    "\uDE3E",
    "A",
    "AA",

    "\uD867",
    "\uDE3E",
    "A",
    "\u0000",
    "A",
  ];

  // deno-lint-ignore no-explicit-any
  let ti: any;
  const s = new ReadableStream({
    start(controller) {
      let c = 0;
      ti = setInterval(() => {
        if (c >= 15) {
          clearInterval(ti);
          controller.close();
          return;
        }
        controller.enqueue(td[c]);
        c = c + 1;
      }, 10);
    },
  });

  await (() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  })();

  const encoder1 = new Utf16.Be.EncoderStream();

  const result = new Uint8Array(40);
  let written = 0;
  const ws = new WritableStream({
    write(chunk) {
      result.set(chunk, written);
      written = written + chunk.byteLength;
    },
  });
  await s.pipeThrough(encoder1).pipeTo(ws);
  await s.pipeTo(ws);

  const expected = "0x00,0x41,0x00,0x42,0x00," +
    "0x43,0x30,0x42,0xFF,0xFD," +
    "0x00,0x41,0xD8,0x67,0xDE," +
    "0x3E,0x00,0x41,0xFF,0xFD," +
    "0x00,0x41,0x00,0x41,0x00," +
    "0x41,0xD8,0x67,0xDE,0x3E," +
    "0x00,0x41,0x00,0x00,0x00," +
    "0x41,0x00,0x00,0x00,0x00";

  // assertStrictEquals(decoder.decode(result), td.join(""));
  assertStrictEquals(
    [...result].map((e) => "0x" + e.toString(16).toUpperCase().padStart(2, "0"))
      .join(","),
    expected,
  );
});

Deno.test("Utf16.Be.EncoderStream.prototype.writable - 2", async () => {
  const td = [
    "ABC",
    "あ",
    "\uD867",
    "",
    "A",

    "\uD867\uDE3E",
    "A",
    "\uDE3E",
    "A",
    "AA",

    "\uD867",
    "\uDE3E",
    "A",
    "\u0000",
    "\uD800",
  ];

  // deno-lint-ignore no-explicit-any
  let ti: any;
  const s = new ReadableStream({
    start(controller) {
      let c = 0;
      ti = setInterval(() => {
        if (c >= 15) {
          clearInterval(ti);
          controller.close();
          return;
        }
        controller.enqueue(td[c]);
        c = c + 1;
      }, 10);
    },
  });

  await (() => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 200);
    });
  })();

  const encoder1 = new Utf16.Be.EncoderStream();

  const result = new Uint8Array(40);
  let written = 0;
  const ws = new WritableStream({
    write(chunk) {
      result.set(chunk, written);
      written = written + chunk.byteLength;
    },
  });
  await s.pipeThrough(encoder1).pipeTo(ws);
  await s.pipeTo(ws);

  const expected = "0x00,0x41,0x00,0x42,0x00," +
    "0x43,0x30,0x42,0xFF,0xFD," +
    "0x00,0x41,0xD8,0x67,0xDE," +
    "0x3E,0x00,0x41,0xFF,0xFD," +
    "0x00,0x41,0x00,0x41,0x00," +
    "0x41,0xD8,0x67,0xDE,0x3E," +
    "0x00,0x41,0x00,0x00,0xFF," +
    "0xFD,0x00,0x00,0x00,0x00";

  assertStrictEquals(
    [...result].map((e) => "0x" + e.toString(16).toUpperCase().padStart(2, "0"))
      .join(","),
    expected,
  );
});
