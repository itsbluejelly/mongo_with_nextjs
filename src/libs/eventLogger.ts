// IMPORTING NECESSARY MODULES
import fs from "fs"
import path from "path"
import {v4 as uuid} from "uuid"
import {format} from "date-fns"

const fsPromises: typeof fs.promises = fs.promises

// A FUNCTION THAT LOGS OUT MESSAGES AT THE REQUIRED PATH
export default async function eventLogger(message1: unknown, message2: unknown, fileName: string): Promise<void>{
    const dateTime: string = format(new Date(), "do MMM yyyy\tHH:mm:ss aaaa")
    const folderPath: string = path.join(__dirname, "..", "..", "..", "..", "logs")
    
    try{
        const loggedItem = `${dateTime}\t${uuid()}\t${message1}\t${message2}\n`

        if(!fs.existsSync(folderPath)){
            await fsPromises.mkdir(folderPath)
        }

        await fsPromises.appendFile(path.join(folderPath, fileName), loggedItem)
    }catch(error: unknown){
        const errorItem = `${dateTime}\t${uuid()}\t${(error as Error).name}\t${(error as Error).message}\n`

        try{
            if(!fs.existsSync(folderPath)){
                await fsPromises.mkdir(folderPath)
            }
            
            await fsPromises.appendFile(path.join(folderPath, "errorLogs.txt"), errorItem)
        }catch(secondError: unknown){
            console.error(`${dateTime}\t${uuid()}\t${(secondError as Error).name}\t${(secondError as Error).message}\n`)
        }
    }
}