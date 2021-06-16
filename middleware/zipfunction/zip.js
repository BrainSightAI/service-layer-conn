const decompress = require("decompress");
const zippy = require("../fetch/fetching")
const zipobj = new zippy();

async function authenticate(req, res, next) {
    var zipPath = process.cwd() + "/zipyfy/zip/" + req.files[0].originalname;
    const data = JSON.parse(req.body.body);
    const hospital = data.userId;
    const patientId = data.patientId;

    var unzipPath = process.cwd() + "/zipyfy/unzip";
    //unzipping the file
    await (async() => {
        try {
            const files = await decompress(zipPath, unzipPath);
            console.log("unziping is done");
        } catch (error) {
            console.log(error);
        }
    })();
    await zipobj.recursivecall(unzipPath, hospital, patientId)
    next();
}
module.exports = authenticate;