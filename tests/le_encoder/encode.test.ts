import { assertStrictEquals, assertThrows } from "../deps.ts";
import { Utf16 } from "../../mod.ts";

const decoder = new TextDecoder("utf-16le");

Deno.test("Utf16.Le.Encoder.encode(string)", () => {
  const encoder = new Utf16.Le.Encoder();

  // encode()
  assertStrictEquals(JSON.stringify([...encoder.encode()]), "[]");

  // encode(string)
  assertStrictEquals(JSON.stringify([...encoder.encode("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...encoder.encode("ABCD")]),
    "[65,0,66,0,67,0,68,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[0,0,255,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[0,1]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[255,254,66,48,68,48,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[255,254,66,48,68,48,64,216,11,220,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00う")]),
    "[66,48,68,48,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00\uD800う")]),
    "[66,48,68,48,253,255,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD800う")]),
    "[66,48,68,48,253,255,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD7FFう")]),
    "[66,48,68,48,253,255,255,215,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あいう\uD800")]),
    "[66,48,68,48,70,48,253,255]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あいう\uDC00")]),
    "[66,48,68,48,70,48,253,255]",
  );

  // encode(any)
  assertStrictEquals(
    JSON.stringify([...encoder.encode(0 as unknown as string)]),
    "[48,0]",
  );
});

Deno.test("Utf16.Le.Encoder.encode(string) - strict", () => {
  const encoder = new Utf16.Le.Encoder({ strict: true });

  // encode()
  assertThrows(
    () => {
      encoder.encode();
    },
    TypeError,
    "srcRunesAsString",
  );

  // encode(string)
  assertStrictEquals(JSON.stringify([...encoder.encode("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...encoder.encode("ABCD")]),
    "[65,0,66,0,67,0,68,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[0,0,255,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[0,1]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[255,254,66,48,68,48,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[255,254,66,48,68,48,64,216,11,220,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00う")]),
    "[66,48,68,48,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00\uD800う")]),
    "[66,48,68,48,253,255,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD800う")]),
    "[66,48,68,48,253,255,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD7FFう")]),
    "[66,48,68,48,253,255,255,215,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あいう\uD800")]),
    "[66,48,68,48,70,48,253,255]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あいう\uDC00")]),
    "[66,48,68,48,70,48,253,255]",
  );

  // encode(any)
  assertThrows(
    () => {
      encoder.encode(0 as unknown as string);
    },
    TypeError,
    "srcRunesAsString",
  );
});

Deno.test("Utf16.Le.Encoder.encode(string) - prependBOM", () => {
  const encoder = new Utf16.Le.Encoder({ prependBOM: true });

  // encode()
  assertStrictEquals(
    JSON.stringify([...encoder.encode(undefined)]),
    "[255,254]",
  );

  // encode(string)
  assertStrictEquals(JSON.stringify([...encoder.encode("")]), "[255,254]");
  assertStrictEquals(
    JSON.stringify([...encoder.encode("ABCD")]),
    "[255,254,65,0,66,0,67,0,68,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[255,254,0,0,255,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[255,254,0,1]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[255,254,66,48,68,48,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[255,254,66,48,68,48,64,216,11,220,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00う")]),
    "[255,254,66,48,68,48,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00\uD800う")]),
    "[255,254,66,48,68,48,253,255,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD800う")]),
    "[255,254,66,48,68,48,253,255,253,255,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD7FFう")]),
    "[255,254,66,48,68,48,253,255,255,215,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あいう\uD800")]),
    "[255,254,66,48,68,48,70,48,253,255]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あいう\uDC00")]),
    "[255,254,66,48,68,48,70,48,253,255]",
  );

  // encode(any)
  assertStrictEquals(
    JSON.stringify([...encoder.encode(0 as unknown as string)]),
    "[255,254,48,0]",
  );
});

Deno.test("Utf16.Le.Encoder.encode(string) - fatal", () => {
  const encoder = new Utf16.Le.Encoder({ fatal: true });

  // encode()
  assertStrictEquals(
    JSON.stringify([...encoder.encode(undefined)]),
    "[]",
  );

  // encode(string)
  assertStrictEquals(JSON.stringify([...encoder.encode("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...encoder.encode("ABCD")]),
    "[65,0,66,0,67,0,68,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[0,0,255,0]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[0,1]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[255,254,66,48,68,48,70,48]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[255,254,66,48,68,48,64,216,11,220,70,48]",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uDC00う");
    },
    TypeError,
    "encode-error: U+DC00",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uDC00\uD800う");
    },
    TypeError,
    "encode-error: U+DC00",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uD800\uD800う");
    },
    TypeError,
    "encode-error: U+D800",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uD800\uD7FFう");
    },
    TypeError,
    "encode-error: U+D800",
  );

  assertThrows(
    () => {
      encoder.encode("あいう\uD800");
    },
    TypeError,
    "encode-error: U+D800",
  );

  assertThrows(
    () => {
      encoder.encode("あいう\uDC00");
    },
    TypeError,
    "encode-error: U+DC00",
  );

  // encode(any)
  assertStrictEquals(
    JSON.stringify([...encoder.encode(0 as unknown as string)]),
    "[48,0]",
  );
});

Deno.test("Utf16.Le.Encoder", () => {
  const str1 = "👪a👨‍👦👨‍👨‍👦‍👦";

  const encoder1 = new Utf16.Le.Encoder();
  const encoded1 = encoder1.encode(str1);
  assertStrictEquals(decoder.decode(encoded1), str1);

  const encoder2 = new Utf16.Le.Encoder({ prependBOM: true });
  const encoded2 = encoder2.encode(str1);
  assertStrictEquals(decoder.decode(encoded2), str1);
});
