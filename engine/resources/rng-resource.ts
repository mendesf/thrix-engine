import { createCryptoKey, deriveFloat01_53, getCrypto, hexToArrayBuffer } from "thrix/std/rng.ts";
import { TaskResult } from "thrix/std/task.ts";
import { Result } from "thrix/std/result.ts";

export class RngResource {
    private readonly serverSeed = "seupaitemboi";
    private crypto: Crypto | undefined;
    private key: CryptoKey | undefined;

    async init(): Promise<void> {
        const cryptoResult = getCrypto();
        if (cryptoResult.isErr()) {
            throw new Error(cryptoResult.value);
        }
        const crypto = cryptoResult.unwrap();
        const bufferResult = hexToArrayBuffer(this.serverSeed);
        if (bufferResult.isErr()) {
            throw new Error(bufferResult.value);
        }
        const keyData = bufferResult.unwrap();
        const keyResult = await createCryptoKey(crypto, keyData);
        if (keyResult.isErr()) {
            throw new Error(keyResult.value);
        }
        const key = keyResult.unwrap();
        this.crypto = crypto;
        this.key = key;
    }

    async randomFloat(clientSeed: string): TaskResult<number, string> {
        if (!this.crypto || !this.key) {
            return Result.err("RngResource not initialized");
        }
        return deriveFloat01_53(this.crypto, this.key, clientSeed);
    }
}