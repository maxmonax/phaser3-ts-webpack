import { MyMath } from './MyMath';

export class MyUtils {
  private static queryValues: Record<string, string | string[]> | null = null;

  private static readQueryValues() {
    const vals: Record<string, string | string[]> = {};
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      const key = pair[0];
      const val = decodeURIComponent(pair[1] ?? '');
      if (typeof vals[key] === 'undefined') {
        vals[key] = val;
      } else if (typeof vals[key] === 'string') {
        vals[key] = [vals[key] as string, val];
      } else {
        (vals[key] as string[]).push(val);
      }
    }
    this.queryValues = vals;
  }

  /**
   * Get GET value by key
   */
  public static getQueryValue(aValName: string): string | string[] | undefined {
    if (this.queryValues === null) this.readQueryValues();
    return this.queryValues![aValName];
  }

  public static getFileName(aFilePath: string): string {
    return (aFilePath.split('\\').pop() ?? aFilePath).split('/').pop() ?? aFilePath;
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
      } else {
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

  static getRandomValueFromArray<T>(aMas: T[]): T {
    const id = MyMath.randomIntInRange(0, aMas.length - 1);
    return aMas[id];
  }
}
