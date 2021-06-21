const decompress = require("decompress");
const zippy = require("../fetch/fetching")
const zipobj = new zippy();

async function authenticate(req, res, next) {
    var zipPath = process.cwd() + "/zipyfy/zip/" + req.files[0].originalname;
    const data = JSON.parse(req.body.body);
    const hospital = data.userId;
    var strings = hospital.split("@");
    var str = strings[1]
    var stri = str.split(".");
    var hospitalname = stri[0];

    const patientId = data.patientId;
    const Disorder = JSON.parse(data.patient).crf.condition;





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
    await zipobj.recursivecall(unzipPath, hospitalname, patientId, Disorder)
    next();
}
module.exports = authenticate;