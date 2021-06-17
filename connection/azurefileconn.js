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
        var zipfile = "diacomh.zip";
        const directoryClent = this.fileconnection();



        async function main() {
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
                // const diryName = (directoryName + "/" + dirName)
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
                    await cretecheck(hospitals)
                    return false;
                } else if (count === arr.length) {
                    var dirrectoryName = (hospitalname + "/" + patientname + "/" + Disorder);
                    var dirrectorycreate = (directoryName + "/" + hospitalname + "/" + patientname + "/" + Disorder);
                    await ifnotexist(dirrectoryName, directoryClit, dirrectorycreate);
                    console.log(hospitalname + "/" + patientname + "/" + Disorder + "....created");
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
                        let dirIter = directoryclnt1.listFilesAndDirectories();
                        for await (const item of dirIter) {
                            if (item.name === Disorder) {
                                var azurepath = (directoryName + "/" + hospitalname + "/" + patientname + "/" + Disorder);
                                await uploadfile(azurepath);
                            }
                        }
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


            async function cretecheck(hospitals) {
                if (hospitals === hospitalname) {
                    var azurepath = (directoryName + "/" + hospitalname);
                    const directoryclnt1 = conn(azurepath);
                    let dirIterr = directoryclnt1.listFilesAndDirectories();
                    await array(dirIterr);
                    await paitentcheck();
                    // if (item.name === patientname) {
                    //     var azurepath = (directoryName + "/" + hospitalname + "/" + patientname);
                    //     const directoryclnt1 = conn(azurepath);
                    //     let dirIter = directoryclnt1.listFilesAndDirectories();
                    //     for await (const item of dirIter) {
                    //         if (item.name === Disorder) {
                    //             var azurepath = (directoryName + "/" + hospitalname + "/" + patientname + "/" + Disorder);
                    //             await uploadfile(azurepath);
                    //         }
                    //     }
                    // }

                }

            }
        }
        await main();
    }
}


module.exports = azure;















// // arr.forEach(
// if (item.name === hospitalname) {
//     count++;
//     var azurepath = (directoryName + "/" + hospitalname);
//     const directoryclnt1 = conn(azurepath);
//     let dirIter = directoryclnt1.listFilesAndDirectories();
//     for await (const item of dirIter) {
//         if (item.name === patientname) {
//             var azurepath = (directoryName + "/" + hospitalname + "/" + patientname);
//             const directoryclnt1 = conn(azurepath);
//             let dirIter = directoryclnt1.listFilesAndDirectories();
//             for await (const item of dirIter) {
//                 if (item.name === "DCN") {
//                     var azurepath = (directoryName + "/" + hospitalname + "/" + patientname + "/" + "DCN");
//                     await uploadfile(azurepath);
//                 }
//             }
//         }
//     }
// } else if (count === 0) {
//     var dirName = (hospitalname + "/" + patientname + "/DCN");
//     await ifnotexist(dirName);
//     console.log(hospitalname + "/" + patientname + "/DCN" + "....created");
// }


// const fileName = zipfile;
// const fileClient = directoryClit.getFileClient(fileName);
// var dirr = (process.cwd() + "/output.zip")



// await fileClient.uploadFile(dirr, {
//     rangeSize: 4 * 1024 * 1024,
//     parallelism: 20
// })

// if ((arr.length === count) || (arr[i] !== hospitalname)) {
//     var dirName = (hospitalname + "/" + patientname + "/DCN");
//     await ifnotexist(dirName);
//     console.log(hospitalname + "/" + patientname + "/DCN" + "....created");
// }