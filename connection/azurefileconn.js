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

        // Use StorageSharedKeyCredential with storage account and account key
        // StorageSharedKeyCredential is only available in Node.js runtime, not in browsers
        const credential = new StorageSharedKeyCredential(account, accountKey);
        const serviceClient = new ShareServiceClient(
            // When using AnonymousCredential, following url should include a valid SAS
            `https://${account}.file.core.windows.net`,
            credential
        );
        return serviceClient;
    }

    storage(hospitalname, patientId) {
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
        var directoryName = "Max/patientABC/ECM/input";
        var zipfile = "dcm.zip";
        const directoryClent = this.fileconnection();

        async function main() {
            const directoryClient = directoryClent
                .getShareClient(shareName)
                .getDirectoryClient(directoryName);
            const fileName = zipfile;
            const fileClient = directoryClient.getFileClient(fileName);
            var dirr = (process.cwd() + "/output.zip")
            await fileClient.uploadFile(dirr, {
                rangeSize: 4 * 1024 * 1024,
                parallelism: 20
            })
        }
        main();
    }
}


module.exports = azure;