export class BasicUtils {

  static getDataSetForChart(label: string, array: any, backgroundColor: string, borderColor: string): ChartDataSet {
    return {
            label: label,
            data: array,
            backgroundColor: Array(array.length).fill(backgroundColor),
            borderColor: Array(array.length).fill(borderColor),
            borderWidth: 1,
          };
  }

}

export interface ChartDataSet {
  label: string;
    data: number[];
    backgroundColor: any[];
    borderColor: any[];
    borderWidth: number
}
