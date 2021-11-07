import Filter from "./arachnid"
import fs from "fs"
import {config} from "dotenv";

config()
const arach = new Filter({apikey: process.env.ARACH_KEY! + "sex", url: process.env.ARACH_URL!})
    async function check() {
    arach.onError((err, raw) => {
        console.log("Error: ", err)
    })
    console.log("Testing with readable stream")
        const stream = fs.createReadStream(`${process.cwd()}/defPfp.png`)
        const r = await arach.isImageSafe(stream, "defPfp.png", "image/png").catch(err => {
					console.log("Promise errored", err)
				})
        console.log("Response: ", r)

        console.log("Testing with raw buffer")
        const file = fs.readFileSync(`${process.cwd()}/defPfp.png`)
        const resp = await arach.isImageSafe(file, "defPfp.png", "image/png")
        console.log("Response: ", resp)
}
check()
