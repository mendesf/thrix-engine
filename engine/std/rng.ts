import { Result } from "./result.ts";
import { Range } from "./range.ts";
import { ofPromise, TaskResult } from "thrix/std/task.ts";

export function getCrypto(): Result<Crypto, string> {
    if (typeof globalThis !== "undefined" && globalThis.crypto) {
        return Result.ok(globalThis.crypto);
    }
    return Result.err("Web Crypto API not available");
}

export function hexToArrayBuffer(hex: string): Result<ArrayBuffer, string> {
    if (hex.length % 2 !== 0) Result.err("Invalid hex string");
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return Result.ok(out.buffer);
}

function hmacSha256(crypto: Crypto, key: CryptoKey, msg: string): TaskResult<ArrayBuffer, string> {
    const enc = new TextEncoder();
    return ofPromise(
        crypto.subtle.sign("HMAC", key, enc.encode(msg)),
        err => err.message);
}

export function createCryptoKey(crypto: Crypto, keyData: ArrayBuffer): TaskResult<CryptoKey, string> {
    return ofPromise(crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    ), err => err.message);
}

/** Derives a deterministic uint32 via HMAC(serverSeed, clientSeed:nonce:purpose:i) */
export async function deriveUint32(crypto: Crypto, key: CryptoKey, clientSeed: string): TaskResult<number, string> {
    const mac = await hmacSha256(crypto, key, clientSeed);
    const view = new DataView(mac.unwrap());
    return Result.ok(view.getUint32(0, false)); // BE
}

/** High-precision float in [0,1) using 53 bits (IEEE754 double full mantissa) */
export async function deriveFloat01_53(crypto: Crypto, key: CryptoKey, clientSeed: string): TaskResult<number, string> {
    const hi = await deriveUint32(crypto, key, `${clientSeed}_hi`);
    if (hi.isErr()) {
        return Result.err(hi.value);
    }
    const lo = await deriveUint32(crypto, key, `${clientSeed}_lo`);
    if (lo.isErr()) {
        return Result.err(lo.value);
    }
    const x = hi.unwrap() * 2 ** 21 + (lo.unwrap() >>> 11);
    return Result.ok(x / 2 ** 53);
}

/** Returns a uniform int in [0, range) by re-deriving with i++ until it passes rejection. */
export async function nextUniformInt(
    crypto: Crypto,
    key: CryptoKey,
    clientSeed: string,
    range: Range,
    maxTries = 32
): TaskResult<number, string> {
    const r = range.value;
    const limit = Math.floor(0x100000000 / r) * r;
    for (let i = 0; i < maxTries; i++) {
        const u32Result = await deriveUint32(crypto, key, `${clientSeed}_${i}`);
        if (u32Result.isErr()) {
            return Result.err(u32Result.value);
        }
        const u32 = u32Result.unwrap();
        if (u32 < limit) return Result.ok(u32 % r);
    }
    return Result.err("Failed to produce an unbiased uniform integer — check seeds and purpose");
}
