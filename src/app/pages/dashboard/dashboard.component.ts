import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { Observable, tap, timeout, timer } from 'rxjs';
import { CHART_TIMEOUT_SECONDS, UserData } from 'src/app/interfaces';
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
    private authService: AuthService
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

  updateData(): Observable<any> {
    return this.httpClient.get('assets/dummy-data/user-data.json').pipe( tap(
      data => {
        if (Array.isArray(data)) {
          const newData = data.filter(userData => userData.user === this.authService.getCurrentUser()?.email) as UserData[];
          if (newData.length > 0 &&  JSON.stringify(newData) !== JSON.stringify(this.userData)) {
            this.userData = newData;
            this.userData.forEach((data, index) => {
              this.data.date[index] = data.year + '-' + data.month + '-' + data.day;
              this.data.bpDelta[index] = data.bpDelta;
              this.data.dias[index] = data.dias;
              this.data.sys[index] = data.sys;
              this.data.pulse[index] = data.pulse;
            });
            this.updateRequired = true;
          } else {
            this.updateRequired = false;
          }
        }
      }
    ));
  }

  createChart(): void {
    this.chart = new Chart("canvas", {
      type: 'bar',
      data: {
        labels: this.data.date,
        datasets: [
          BasicUtils.getDataSetForChart('Bp Delta', this.data.bpDelta, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)'),
          BasicUtils.getDataSetForChart('Dias', this.data.dias, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
          BasicUtils.getDataSetForChart('Sys', this.data.sys, 'rgba(255, 206, 86, 0.2)', 'rgba(255, 206, 86, 1)'),
          BasicUtils.getDataSetForChart('Pulse', this.data.pulse, 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 20,
            max: 200,
            ticks: {
              stepSize: 10
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

  updateChart(): void {
    this.chart.data.labels = this.data.date;
    this.chart.data.datasets = [
      BasicUtils.getDataSetForChart('Bp Delta', this.data.bpDelta, 'rgba(255, 99, 132, 0.2)', 'rgba(255, 99, 132, 1)'),
      BasicUtils.getDataSetForChart('Dias', this.data.dias, 'rgba(54, 162, 235, 0.2)', 'rgba(54, 162, 235, 1)'),
      BasicUtils.getDataSetForChart('Sys', this.data.sys, 'rgba(255, 206, 86, 0.2)', 'rgba(255, 206, 86, 1)'),
      BasicUtils.getDataSetForChart('Pulse', this.data.pulse, 'rgba(75, 192, 192, 0.2)', 'rgba(75, 192, 192, 1)'),
    ];
    this.chart.update();
  }

}
