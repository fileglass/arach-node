import Filter from "./arachnid"
import fs from "fs"

const arach = new Filter("########################################################################", "", false)



    async function check() {
    arach.onError(err => {
        console.log("Error: ", err)
    })
    console.log("Testing with readable stream")
        const stream = fs.createReadStream(`${process.cwd()}/defPfp.png`)
        const buff = await arach.convertStreamToBuffer(stream)
        const r = await arach.isImageSafe(buff, "defPfp.png", "image/png")
        console.log("Response: ", r)

        console.log("Testing with raw buffer")
        const file = fs.readFileSync(`${process.cwd()}/defPfp.png`)
        const resp = await arach.isImageSafe(file, "defPfp.png", "image/png")
        console.log("Response: ", resp)
}

check()