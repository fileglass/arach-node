import axios, {AxiosError} from "axios"
import FormData from "form-data";
import {Readable} from "stream"

export type ErrorHandlerFn = (errMsg: string) => void

export interface ArachnidResolvable {
    safe: boolean
    rawResponse: Object[] //TODO! type this properly
    errored: boolean
}


export type Unsafe<Unsafe, Default, Fallback> = Unsafe extends true ? Fallback | Default : Default

export type ImageNameWithExtension = `${string}.${string}`

export type MimeType = `${string}/${string}`


export default class Filter {
    private readonly url: string
    private readonly apiKey: string
    private readonly trueOnError: boolean
    private errHandlerRef: ErrorHandlerFn
    constructor(apiKey: string, url: string, trueOnError = true) {
        this.url = url
        this.apiKey = apiKey
        this.trueOnError = trueOnError
    }

    public async isImageSafe<UnsafeExt = false, UnsafeMime = false>(imgData: Buffer, fileName: Unsafe<UnsafeExt, ImageNameWithExtension, string>, mimeType:  Unsafe<UnsafeMime, ImageNameWithExtension, string>): Promise<ArachnidResolvable> {
        return new Promise<ArachnidResolvable>((resolve, reject) => {
            const fd = new FormData();
            fd.append("image", imgData, {
                knownLength: imgData.length,
                contentType: mimeType,
                filename: fileName,
            });
            axios
                .post<Object[]>(this.url, fd, {
                    headers: {
                        Authorization: this.apiKey,
                        "Content-Length": fd.getLengthSync(),
                        ...fd.getHeaders(),
                    },
                }).then(({data}) => {
                if (data.length === 0) {
                    resolve({safe: true, rawResponse: data, errored: false})
                } else {
                    resolve({safe: false, rawResponse: data, errored: false})
                }
            }).catch(err => {
                if (this.trueOnError) {
                    resolve({safe: true, rawResponse: [], errored: true})
                } else {
                    this.errHandlerRef ? this.errHandlerRef(err.response.data.error) : (() => {})()
                    reject({safe: false, rawResponse: [], errored: true})
                }
            })
        })

        }


    /***
     * Handlers errors that may occur in the request to Arachnid
     */
    public onError(handler: ErrorHandlerFn): void {
        this.errHandlerRef = handler
    }

    /**
     * Convert readable streams to buffers that the method accepts
     */
    public async convertStreamToBuffer(readable: Readable): Promise<Buffer> {
        const chunks: Uint8Array[] = []
        for await (let chunk of readable) {
            chunks.push(chunk)
        }
        return Buffer.concat(chunks)
    }

}