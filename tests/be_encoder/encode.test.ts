import { assertStrictEquals, assertThrows } from "../deps.ts";
import { Utf16 } from "../../mod.ts";

const decoder = new TextDecoder("utf-16be");

Deno.test("Utf16.Be.Encoder.encode(string)", () => {
  const encoder = new Utf16.Be.Encoder();

  // encode()
  assertStrictEquals(JSON.stringify([...encoder.encode()]), "[]");

  // encode(string)
  assertStrictEquals(JSON.stringify([...encoder.encode("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...encoder.encode("ABCD")]),
    "[0,65,0,66,0,67,0,68]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[0,0,0,255]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[1,0]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[254,255,48,66,48,68,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[254,255,48,66,48,68,216,64,220,11,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00う")]),
    "[48,66,48,68,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00\uD800う")]),
    "[48,66,48,68,255,253,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD800う")]),
    "[48,66,48,68,255,253,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD7FFう")]),
    "[48,66,48,68,255,253,215,255,48,70]",
  );

  // encode(any)
  assertStrictEquals(
    JSON.stringify([...encoder.encode(0 as unknown as string)]),
    "[0,48]",
  );
});

Deno.test("Utf16.Be.Encoder.encode(string) - strict", () => {
  const encoder = new Utf16.Be.Encoder({ strict: true });

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
    "[0,65,0,66,0,67,0,68]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[0,0,0,255]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[1,0]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[254,255,48,66,48,68,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[254,255,48,66,48,68,216,64,220,11,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00う")]),
    "[48,66,48,68,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00\uD800う")]),
    "[48,66,48,68,255,253,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD800う")]),
    "[48,66,48,68,255,253,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD7FFう")]),
    "[48,66,48,68,255,253,215,255,48,70]",
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

Deno.test("Utf16.Be.Encoder.encode(string) - prependBOM", () => {
  const encoder = new Utf16.Be.Encoder({ prependBOM: true });

  // encode()
  assertStrictEquals(
    JSON.stringify([...encoder.encode(undefined)]),
    "[254,255]",
  );

  // encode(string)
  assertStrictEquals(JSON.stringify([...encoder.encode("")]), "[254,255]");
  assertStrictEquals(
    JSON.stringify([...encoder.encode("ABCD")]),
    "[254,255,0,65,0,66,0,67,0,68]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[254,255,0,0,0,255]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[254,255,1,0]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[254,255,48,66,48,68,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[254,255,48,66,48,68,216,64,220,11,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00う")]),
    "[254,255,48,66,48,68,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uDC00\uD800う")]),
    "[254,255,48,66,48,68,255,253,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD800う")]),
    "[254,255,48,66,48,68,255,253,255,253,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("あい\uD800\uD7FFう")]),
    "[254,255,48,66,48,68,255,253,215,255,48,70]",
  );

  // encode(any)
  assertStrictEquals(
    JSON.stringify([...encoder.encode(0 as unknown as string)]),
    "[254,255,0,48]",
  );
});

Deno.test("Utf16.Be.Encoder.encode(string) - fatal", () => {
  const encoder = new Utf16.Be.Encoder({ fatal: true });

  // encode()
  assertStrictEquals(
    JSON.stringify([...encoder.encode(undefined)]),
    "[]",
  );

  // encode(string)
  assertStrictEquals(JSON.stringify([...encoder.encode("")]), "[]");
  assertStrictEquals(
    JSON.stringify([...encoder.encode("ABCD")]),
    "[0,65,0,66,0,67,0,68]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0000\u00FF")]),
    "[0,0,0,255]",
  );
  assertStrictEquals(
    JSON.stringify([...encoder.encode("\u0100")]),
    "[1,0]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあいう")]),
    "[254,255,48,66,48,68,48,70]",
  );

  assertStrictEquals(
    JSON.stringify([...encoder.encode("\uFEFFあい\u{2000B}う")]),
    "[254,255,48,66,48,68,216,64,220,11,48,70]",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uDC00う");
    },
    TypeError,
    "encode-error: \uFFFD U+DC00",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uDC00\uD800う");
    },
    TypeError,
    "encode-error: \uFFFD U+DC00",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uD800\uD800う");
    },
    TypeError,
    "encode-error: \uFFFD U+D800",
  );

  assertThrows(
    () => {
      encoder.encode("あい\uD800\uD7FFう");
    },
    TypeError,
    "encode-error: \uFFFD U+D800",
  );

  // encode(any)
  assertStrictEquals(
    JSON.stringify([...encoder.encode(0 as unknown as string)]),
    "[0,48]",
  );
});

Deno.test("Utf16.Be.Encoder", () => {
  const str1 = "👪a👨‍👦👨‍👨‍👦‍👦";

  const encoder1 = new Utf16.Be.Encoder();
  const encoded1 = encoder1.encode(str1);
  assertStrictEquals(decoder.decode(encoded1), str1);

  const encoder2 = new Utf16.Be.Encoder({ prependBOM: true });
  const encoded2 = encoder2.encode(str1);
  assertStrictEquals(decoder.decode(encoded2), str1);
});
