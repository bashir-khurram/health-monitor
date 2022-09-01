export class LocalStorageUtils {

  static get(key: string): any {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  static set(key: string, data: Object): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }

}
