import {
  CodePoint,
  Rune,
  StringEx,
  TextEncoding,
  Uint16,
  Uint8,
} from "../deps.ts";

const _BE_LABEL = "UTF-16BE";
const _LE_LABEL = "UTF-16LE";

const _MAX_BYTES_PER_RUNE = 4;

type _RuneBytes = Array<Uint8>; // [Uint8, Uint8] | [Uint8, Uint8, Uint8, Uint8] ;

// プラットフォームのバイトオーダーでエンコード
// function _encode(
//   srcString: string,
//   dstBuffer: ArrayBuffer,
//   options: {
//     fatal: boolean; // エンコードのエラーは単独のサロゲートの場合のみ
//     replacementBytes: Array<Uint8>;
//   },
// ): TextEncoderEncodeIntoResult {
// }

function _encodeShared(
  srcString: string,
  dstBuffer: ArrayBuffer,
  options: {
    fatal: boolean; // エンコードのエラーは単独のサロゲートの場合のみ
    replacementBytes: Array<Uint8>;
  },
  littleEndian: boolean,
): TextEncoderEncodeIntoResult {
  const dstView = new DataView(dstBuffer);

  let read = 0;
  let written = 0;

  for (const rune of srcString) {
    const codePoint = rune.codePointAt(0) as CodePoint;

    if ((written + (rune.length * Uint16.BYTES)) > dstView.byteLength) {
      break;
    }
    read = read + rune.length;

    if (CodePoint.isSurrogateCodePoint(codePoint) !== true) {
      for (let i = 0; i < rune.length; i++) {
        dstView.setUint16(
          written,
          rune.charCodeAt(i),
          littleEndian,
        );
        written = written + Uint16.BYTES;
      }
    } else {
      if (options.fatal === true) {
        throw new TypeError(
          `encode-error: \uFFFD ${CodePoint.toString(codePoint)}`,
        );
      } else {
        for (const byte of options.replacementBytes) {
          dstView.setInt8(written, byte);
          written = written + Uint8.BYTES;
        }
      }
    }
  }

  return {
    read,
    written,
  };
}

function _encodeBe(
  srcString: string,
  dstBuffer: ArrayBuffer,
  options: {
    fatal: boolean;
    replacementBytes: Array<Uint8>;
  },
): TextEncoderEncodeIntoResult {
  return _encodeShared(srcString, dstBuffer, options, false);
}

function _encodeLe(
  srcString: string,
  dstBuffer: ArrayBuffer,
  options: {
    fatal: boolean;
    replacementBytes: Array<Uint8>;
  },
): TextEncoderEncodeIntoResult {
  return _encodeShared(srcString, dstBuffer, options, true);
}

const _DEFAULT_REPLACEMENT_CHAR = "\u{FFFD}";
const _DEFAULT_REPLACEMENT_BYTES_BE: _RuneBytes = [0xFF, 0xFD];
const _DEFAULT_REPLACEMENT_BYTES_LE: _RuneBytes = [0xFD, 0xFF];

function _getReplacement(
  replacementRune: unknown,
  littleEndian: boolean,
): { rune: Rune; bytes: _RuneBytes } {
  if (StringEx.isString(replacementRune) && (replacementRune.length === 1)) {
    try {
      const tmp = new ArrayBuffer(_MAX_BYTES_PER_RUNE);
      const { written } = _encodeShared(
        replacementRune,
        tmp,
        {
          fatal: true,
          replacementBytes: littleEndian
            ? _DEFAULT_REPLACEMENT_BYTES_LE
            : _DEFAULT_REPLACEMENT_BYTES_BE,
        },
        littleEndian,
      );
      return {
        rune: replacementRune,
        bytes: [...new Uint8Array(tmp.slice(0, written))] as Array<Uint8>,
      };
    } catch {
      // _DEFAULT_REPLACEMENT_BYTES を返す
    }
  }
  return {
    rune: _DEFAULT_REPLACEMENT_CHAR,
    bytes: littleEndian
      ? _DEFAULT_REPLACEMENT_BYTES_LE
      : _DEFAULT_REPLACEMENT_BYTES_BE,
  };
}

export namespace Utf16 {
  export type EncoderOptions = {
    fatal?: boolean;
    prependBOM?: boolean;
    strict?: boolean;
  };

  // /** @deprecated */
  // export class Encoder extends TextEncoding.Encoder {
  // プラットフォームのバイトオーダーでエンコード
  // }

  // /** @deprecated */
  // export class EncoderStream extends TextEncoding.EncoderStream {
  // プラットフォームのバイトオーダーでエンコード
  // }

  export namespace Be {
    /** @deprecated */
    export class Encoder extends TextEncoding.Encoder {
      constructor(options: EncoderOptions = {}) {
        super({
          name: _BE_LABEL,
          fatal: options?.fatal === true,
          replacementBytes:
            _getReplacement(_DEFAULT_REPLACEMENT_CHAR, false).bytes,
          encode: _encodeBe,
          prependBOM: options?.prependBOM === true,
          strict: options?.strict === true,
          maxBytesPerRune: _MAX_BYTES_PER_RUNE,
        });
      }
    }

    /** @deprecated */
    export class EncoderStream extends TextEncoding.EncoderStream {
      constructor(options: EncoderOptions = {}) {
        super({
          name: _BE_LABEL,
          fatal: options?.fatal === true,
          replacementBytes:
            _getReplacement(_DEFAULT_REPLACEMENT_CHAR, false).bytes,
          encode: _encodeBe,
          prependBOM: options?.prependBOM === true,
          strict: options?.strict === true,
          maxBytesPerRune: _MAX_BYTES_PER_RUNE,
        });
      }
    }
  }

  export namespace Le {
    /** @deprecated */
    export class Encoder extends TextEncoding.Encoder {
      constructor(options: EncoderOptions = {}) {
        super({
          name: _LE_LABEL,
          fatal: options?.fatal === true,
          replacementBytes:
            _getReplacement(_DEFAULT_REPLACEMENT_CHAR, true).bytes,
          encode: _encodeLe,
          prependBOM: options?.prependBOM === true,
          strict: options?.strict === true,
          maxBytesPerRune: _MAX_BYTES_PER_RUNE,
        });
      }
    }

    /** @deprecated */
    export class EncoderStream extends TextEncoding.EncoderStream {
      constructor(options: EncoderOptions = {}) {
        super({
          name: _LE_LABEL,
          fatal: options?.fatal === true,
          replacementBytes:
            _getReplacement(_DEFAULT_REPLACEMENT_CHAR, true).bytes,
          encode: _encodeLe,
          prependBOM: options?.prependBOM === true,
          strict: options?.strict === true,
          maxBytesPerRune: _MAX_BYTES_PER_RUNE,
        });
      }
    }
  }
}
