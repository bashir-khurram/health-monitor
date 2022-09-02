import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Observable, tap, timeout, timer } from 'rxjs';
import { CHART_COLORS, CHART_TIMEOUT_SECONDS, UserData } from 'src/app/interfaces';
import { AuthService } from 'src/app/services/auth.service';
import { BasicUtils } from 'src/app/utils/basic-utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('canvas', {static: false}) canvas: ElementRef| undefined;

  minValue: number = 0;
  maxValue: number = 0;
  interval: number = 0;
  dataType: 'simple' | 'log' = 'log';

  private chart: Chart;
  private updateRequired: boolean = false;
  private userData: UserData[] = [];
  private data: {
    bpDelta: number[],
    dias: number[],
    sys: number[],
    pulse: number[],
    date: string[]
  } = {
    bpDelta: [],
    dias: [],
    sys: [],
    pulse: [],
    date: []
  };

  constructor(
    private httpClient: HttpClient,
    public authService: AuthService
    ) {
    }

  ngOnInit(): void {
    timer(0, CHART_TIMEOUT_SECONDS * 1000)
    .subscribe((counter) => this.updateData().subscribe(() => this.updateRequired ? this.updateChart() : false));
  }

  ngAfterViewInit(): void {
    this.updateData().subscribe(() => this.createChart());
  }

  updateConfig(): void  {
    (this.chart.options.scales as any) ['y']['min'] = this.minValue;
    (this.chart.options.scales as any) ['y']['max'] = this.maxValue;
    (this.chart.options.scales as any) ['y']['ticks']['stepSize'] = this.interval;
    this.chart.update();
  }

  changeDataType(): void {
    this.userData = [];
    this.updateData().subscribe(() => {
      switch (this.dataType) {
        case  'simple':
          (this.chart.options.scales as any) ['y']['min'] = this.minValue = 0;
          (this.chart.options.scales as any) ['y']['max'] = this.maxValue =
            Math.max(...this.data.bpDelta, ...this.data.dias, ...this.data.sys, ...this.data.pulse);
          (this.chart.options.scales as any) ['y']['ticks']['stepSize'] = this.interval = 10;
          break;
        case 'log':
          (this.chart.options.scales as any) ['y']['min'] = this.minValue = 0;
          (this.chart.options.scales as any) ['y']['max'] = this.maxValue =
            Math.max(...this.data.bpDelta, ...this.data.dias, ...this.data.sys, ...this.data.pulse);
          (this.chart.options.scales as any) ['y']['ticks']['stepSize'] = this.interval = 0.5;
          break;
      }
      this.updateChart();
    });

  }

  private updateData(): Observable<any> {
    return this.httpClient.get('assets/dummy-data/user-data.json').pipe( tap(
      data => {
        if (Array.isArray(data)) {
          const newData = data.filter(userData => userData.user === this.authService.getCurrentUser()?.email) as UserData[];
          if (newData.length > 0 &&  JSON.stringify(newData) !== JSON.stringify(this.userData)) {
            this.resetData();
            this.userData = newData;
            this.userData.forEach((data, index) => {
              this.data.date.push(data.year + '-' + data.month + '-' + data.day) ;
              this.data.bpDelta.push(this.dataType === 'log'? Math.log(data.bpDelta): data.bpDelta);
              this.data.dias.push(this.dataType === 'log'? Math.log(data.dias): data.dias);
              this.data.sys.push(this.dataType === 'log'? Math.log(data.sys): data.sys);
              this.data.pulse.push(this.dataType === 'log'? Math.log(data.pulse): data.pulse);
            });
            this.updateRequired = true;
          } else {
            this.updateRequired = false;
          }
        }
      }
    ));
  }

  private createChart(): void {
    this.chart = new Chart("canvas", {
      type: 'bar',
      data: {
        labels: this.data.date,
        datasets: this.getChartDataset(),
      },
      options: {
        responsive: true,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            min: 0,
            max: Math.max(...this.data.bpDelta, ...this.data.dias, ...this.data.sys, ...this.data.pulse),
            ticks: {
              stepSize: 0.5
            }
          },
        },
      },
      plugins: [
      ]
    });
    this.minValue = (this.chart.options.scales as any) ['y']['min'];
    this.maxValue = (this.chart.options.scales as any) ['y']['max'];
    this.interval = (this.chart.options.scales as any) ['y']['ticks']['stepSize'];
  }

  private updateChart(): void {
    this.chart.data.labels = this.data.date;
    this.chart.data.datasets = this.getChartDataset();
    this.chart.update();
  }

  private getChartDataset(): any[] {
    return [
      BasicUtils.getDataSetForChart('Bp Delta', this.data.bpDelta, CHART_COLORS.blue.bkgrndColor, CHART_COLORS.blue.borderColor),
      BasicUtils.getDataSetForChart('Dias', this.data.dias, CHART_COLORS.red.bkgrndColor, CHART_COLORS.red.borderColor),
      BasicUtils.getDataSetForChart('Sys', this.data.sys, CHART_COLORS.purple.bkgrndColor, CHART_COLORS.purple.borderColor),
      BasicUtils.getDataSetForChart('Pulse', this.data.pulse, CHART_COLORS.orange.bkgrndColor, CHART_COLORS.orange.borderColor)
    ];
  }

  private resetData(): void {
    this.data = {
      bpDelta: [],
      dias: [],
      sys: [],
      pulse: [],
      date: []
    };
    this.userData = [];
  }

}
