import axios, {AxiosError} from "axios"
import FormData from "form-data";
import {Readable} from "stream"
import ReadableStream = NodeJS.ReadableStream;

export type ErrorHandlerFn = (errMsg: string, rawErr: any) => void


export interface ArachnidMatch {
    classification: string
    distance: number
    sha1: string
    type: string
}

export interface ArachnidResolvable {
    safe: boolean
    rawResponse: ArachnidMatch[]
    errored: boolean
}


export type Unsafe<Unsafe, Default, Fallback> = Unsafe extends true ? Fallback | Default : Default

export type ImageNameWithExtension = `${string}.${string}`

export type MimeType = `${string}/${string}`

export interface ArachnidConfig {
	apikey: string,
	url: string
	trueOnError?: boolean
	exitOnErr?: boolean
}

export default class Filter {
    private errHandlerRef: ErrorHandlerFn
		private readonly apiKey: string;
		private readonly url: string;
		private readonly trueOnError: boolean
		private readonly exitOnErr: boolean
    constructor(config: ArachnidConfig) {
			this.apiKey = config.apikey
			this.url = config.url
			this.trueOnError = config.trueOnError || true
			this.exitOnErr = config.exitOnErr || false
		}

		private dispatchErr(err: any) {
			this.errHandlerRef ? this.errHandlerRef(err?.response?.data?.error || "", err) : (() => {})()
			if (this.exitOnErr) {
				throw err
			}
		}

    public async isImageSafe<UnsafeExt = false, UnsafeMime = false>(imgData: Buffer | Readable | ReadableStream, fileName: Unsafe<UnsafeExt, ImageNameWithExtension, string>, mimeType:  Unsafe<UnsafeMime, MimeType, string>): Promise<ArachnidResolvable> {
			const fd = new FormData();
			if (imgData instanceof Buffer) {
				fd.append("image", imgData, {
					knownLength: imgData.length,
					contentType: mimeType,
					filename: fileName,
				});
			} else {
				fd.append("image", imgData, {
					contentType: mimeType,
					filename: fileName,
				})
			}
			try {
				const {data}  = await axios
					.post<ArachnidMatch[]>(this.url, fd, {
						headers: {
							Authorization: this.apiKey,
							...fd.getHeaders(),
						},
					})
				if (data.length === 0) {
					return {safe: true, rawResponse: data, errored: false}
				} else {
					return {safe: false, rawResponse: data, errored: false}
				}
			} catch (err) {
				if (this.trueOnError) {
					this.dispatchErr(err);
					return {safe: true, rawResponse: [], errored: true}
				} else {
					this.dispatchErr(err);
					return {safe: false, rawResponse: [], errored: true}
				}
			}


        }


    /***
     * Handlers errors that may occur in the request to Arachnid
     */
    public onError(handler: ErrorHandlerFn): void {
        this.errHandlerRef = handler
    }

    /**
     * `isImageSafe` supports Readable streams since version 2.0.
		 * 	@deprecated
     */
    public async convertStreamToBuffer(readable: Readable): Promise<Buffer> {
        const chunks: Uint8Array[] = []
        for await (let chunk of readable) {
            chunks.push(chunk)
        }
        return Buffer.concat(chunks)
    }

}
