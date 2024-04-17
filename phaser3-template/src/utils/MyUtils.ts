
export class MyUtils {

    private static queryValues: { [index: string]: string }[] = null;

    private static readQueryValues() {
        // This function is anonymous, is executed immediately and
        // the return value is assigned to QueryString!
        var vals: any = {};
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            // If first entry with this name
            if (typeof vals[pair[0]] === "undefined") {
                vals[pair[0]] = decodeURIComponent(pair[1]);
                // If second entry with this name
            } else if (typeof vals[pair[0]] === "string") {
                var arr = [vals[pair[0]], decodeURIComponent(pair[1])];
                vals[pair[0]] = arr;
                // If third or later entry with this name
            } else {
                vals[pair[0]].push(decodeURIComponent(pair[1]));
            }
        }
        this.queryValues = vals;
    }

    /**
     * Get GET value by key
     * @param aValName 
     * @returns 
     */
    public static getQueryValue(aValName: string): any {
        if (this.queryValues == null) this.readQueryValues();
        return this.queryValues[aValName];
    }

    public static getFileName(aFilePath: string): string {
        return aFilePath.split('\\').pop().split('/').pop();
    }

    public static getFileExt(aFileName: string, ignore?: string[]): string {
        let fileType = '';
        for (let i = aFileName.length - 1; i >= 0; i--) {
            if (aFileName[i] == '.') {
                if (ignore && ignore.indexOf(fileType) >= 0) {
                    // ignore types
                    fileType = '';
                    continue;
                }
                break;
            }
            else {
                fileType = aFileName[i] + fileType;
            }
        }
        fileType.toLowerCase();
        return fileType;
    }

    public static secondsToHMS(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.round(seconds % 60);

        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = remainingSeconds.toString().padStart(2, '0');

        return `${hoursStr}:${minutesStr}:${secondsStr}`;
    }

}