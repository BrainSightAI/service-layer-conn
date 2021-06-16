const fs = require("fs")

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



    async storage(hospitalname, patientId) {
        function hospital(hospitalname) {
            var strings = hospitalname.split("@");
            var str = strings[1]
            var stri = str.split(".");
            var strng = stri[0];
            return strng
        }
        var hospitalname = hospital(hospitalname);
        var patientname = patientId;

        var shareName = "training";
        var directoryName = "Hospital";
        var zipfile = "dicom.zip";
        const directoryClent = this.fileconnection();



        async function main() {
            function conn(directoryName) {
                const directoryClient = directoryClent
                    .getShareClient(shareName)
                    .getDirectoryClient(directoryName);
                return directoryClient
            }
            const directoryClit = conn(directoryName);


            let dirIter = directoryClit.listFilesAndDirectories();
            for await (const item of dirIter) {
                if (item.name === hospitalname) {
                    var azurepath = (directoryName + "/" + hospitalname)
                    const directoryclnt1 = conn(azurepath)
                    let dirIter = directoryclnt1.listFilesAndDirectories();
                    for await (const item of dirIter) {
                        if (item.name === patientname) {
                            var azurepath = (directoryName + "/" + hospitalname + "/" + patientname)
                            const directoryclnt1 = conn(azurepath)
                            let dirIter = directoryclnt1.listFilesAndDirectories();
                            for await (const item of dirIter) {
                                if (item.name === "Malaria") {
                                    var azurepath = (directoryName + "/" + hospitalname + "/" + patientname + "/" + "Malaria")
                                    const directoryclnt1 = conn(azurepath)
                                    const fileName = zipfile;
                                    const fileClient = directoryclnt1.getFileClient(fileName);
                                    var dirr = (process.cwd() + "/output.zip")
                                    await fileClient.uploadFile(dirr, {
                                        rangeSize: 4 * 1024 * 1024,
                                        parallelism: 20
                                    })
                                }
                            }
                        }
                    }
                } else {
                    // const shareClient = directoryClent.getShareClient(shareName);
                    // // var directoryname = ("directoryName" + "/" + hospitalname + "/" + patientname + "/DCN")
                    // var directoryname = ("directoryName/same")
                    // const directoryClient = shareClient.getDirectoryClient(directoryname);
                    // await directoryClient.create();

                    console.log("not exits")
                }
            }
            // const fileName = zipfile;
            // const fileClient = directoryClit.getFileClient(fileName);
            // var dirr = (process.cwd() + "/output.zip")



            // await fileClient.uploadFile(dirr, {
            //     rangeSize: 4 * 1024 * 1024,
            //     parallelism: 20
            // })
        }
        await main();
    }
}


module.exports = azure;