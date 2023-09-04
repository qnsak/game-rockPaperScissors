import {rockPaperScissors} from "./rule.js"
import {generateSecretKey} from "./secretkey.js"
import {connection} from "./ws.js"
import {screenControl} from "./screenControl.js"

let lib = {
    rockPaperScissors: rockPaperScissors,
    generateSecretKey: generateSecretKey,
    connection: connection,
    screenControl: screenControl,
};

export default lib;