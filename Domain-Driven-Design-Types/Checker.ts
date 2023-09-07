export class Checker {
  public static isNullOrUndefined(value: any): boolean {
    return value === null || value === undefined || value === '';
  }

  public static isNullOrUndefinedList(array: Array<any>): boolean {
    for (let value in array) {
      if (this.isNullOrUndefined(value)) {
        return true;
      }
    }
    return false;
  }

  public static isEmpty(array: Array<any>): boolean {
    return array.length <= 0;
  }

  public static inRange(number: number, min: number, max: number): boolean {
    return number >= min && number <= max;
  }

  public static stringInRange(
    string: string,
    min: number,
    max: number,
  ): boolean {
    return string.length >= min && string.length <= max;
  }
}
