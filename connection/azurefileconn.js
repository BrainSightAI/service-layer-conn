class azure {
    fileconnection() {
        const {
            ShareServiceClient,
            StorageSharedKeyCredential,
        } = require("@azure/storage-file-share");
        // Enter your storage account name and shared key
        const account = "bsstoragedev";
        const accountKey =
            "lsaU/EdeKneKnhdxclsTZzQzZvtpd0brpCDpnMABDxuJXroIVhX9n8dc/xgGJ+oFeimythsYiItany3axV8XVg==";
        const credential = new StorageSharedKeyCredential(account, accountKey);
        const serviceClient = new ShareServiceClient(
            `https://${account}.file.core.windows.net`,
            credential
        );
        return serviceClient;
    }


    async storage(hospitalname, patientId, Disorder) {

        var hospitalname = hospitalname; ///hospital name
        var patientname = patientId; //patient name
        var shareName = "training";
        var directoryName = "Hospital";
        var zipfile = "diacomh.zip";
        //connection with azure file share
        const directoryClent = this.fileconnection();



        async function main() {

            ///path folder
            function conn(directoryName) {
                const directoryClient = directoryClent
                    .getShareClient(shareName)
                    .getDirectoryClient(directoryName);
                return directoryClient
            }


            async function ifnotexist(dirName, directoryClitt, dirrectorycreate) {
                var buildPath = ""
                var arrayPath = dirName.split('/');
                for (var i = 0; i < arrayPath.length; i++) {
                    buildPath += arrayPath[i];
                    var directory = await directoryClitt.getDirectoryClient(buildPath);
                    await directory.create();
                    buildPath += '/';
                }
                await uploadfile(dirrectorycreate)
            }

            async function uploadfile(dirName) {
                const dirpush = await conn(dirName)
                const fileName = zipfile;
                const fileClient = await dirpush.getFileClient(fileName);
                var dirr = (process.cwd() + "/output.zip")
                await fileClient.uploadFile(dirr, {
                    rangeSize: 4 * 1024 * 1024,
                    parallelism: 20
                })
            }


            const directoryClit = conn(directoryName);
            var count = 0;
            let dirIter = directoryClit.listFilesAndDirectories();
            var arr = [];
            await array(dirIter)
            async function array(dirIter) {
                arr.splice(0, arr.length);
                for await (const item of dirIter) {
                    if (item.kind === "directory") {
                        arr.push(item.name)
                    }
                }
            }

            for (var i = 0; i < arr.length; i++) {
                count++;
                var hospitals = arr[i]
                if (hospitals === hospitalname) {
                    await createcheck(hospitals)
                    return false;
                } else if (count === arr.length) {
                    var dirrectoryName = (hospitalname + "/" + patientname + "/" + Disorder);
                    var dirrectorycreate = (directoryName + "/" + hospitalname + "/" + patientname + "/" + Disorder);
                    await ifnotexist(dirrectoryName, directoryClit, dirrectorycreate);
                    console.log(dirrectoryName + "....created");
                }
            }

            async function disorder() {
                count = 0
                for (var i = 0; i < arr.length; i++) {
                    count++;
                    var Pdisorder = arr[i]
                    if (Pdisorder === Disorder) {
                        var azurepath = (directoryName + "/" + hospitalname + "/" + patientname + "/" + Disorder);
                        await uploadfile(azurepath);
                        return false;
                    } else if (count === arr.length) {
                        var dirpartent = (directoryName + "/" + hospitalname + "/" + patientname)
                        const disorderdirname = conn(dirpartent)
                        var DdirName = (Disorder);
                        var Ddirupload = (dirpartent + "/" + DdirName);
                        await ifnotexist(DdirName, disorderdirname, Ddirupload);
                        console.log(hospitalname + "/" + patientname + "....created");

                    }
                }
            }


            async function paitentcheck() {
                count = 0
                for (var i = 0; i < arr.length; i++) {
                    count++;
                    var patient = arr[i]
                    if (patient === patientname) {
                        var azurepath = (directoryName + "/" + hospitalname + "/" + patientname);
                        const directoryclnt1 = conn(azurepath);
                        let dirIter2 = directoryclnt1.listFilesAndDirectories();
                        await array(dirIter2)
                        await disorder()
                        return false;
                    } else if (count === arr.length) {
                        var dirpartent = (directoryName + "/" + hospitalname)
                        const pdirname = conn(dirpartent)
                        var dirName = (patientname + "/" + Disorder);
                        var dirupload = (dirpartent + "/" + dirName);
                        await ifnotexist(dirName, pdirname, dirupload);
                        console.log(hospitalname + "/" + patientname + "....created");
                    }
                }
            }


            async function createcheck(hospitals) {
                if (hospitals === hospitalname) {
                    var azurepath = (directoryName + "/" + hospitalname);
                    const directoryclnt1 = conn(azurepath);
                    let dirIterr = directoryclnt1.listFilesAndDirectories();
                    await array(dirIterr);
                    await paitentcheck();

                }

            }
        }
        await main();
    }
}


module.exports = azure;