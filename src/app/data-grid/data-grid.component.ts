import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';

export interface Range {
  id: number;
  time: string;
  value: string;
}

interface SelectTime {
  id: number;
  value: number;
  text: string
}

interface FilteredTimeItem {
  time: string;
  items?: Range[];
}


@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css']
})
export class DataGridComponent implements OnInit {

  selectedValue: number = 60 / 5;

  timeIntervals: SelectTime[] = [
    {id: 1, value: 60 / 5, text: '5 min'},
    {id: 2, value: 60 / 30, text: '30 min'},
    {id: 3, value: 60 / 60, text: '1 hour'},
  ];

  ranges: FilteredTimeItem[] = [];
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;

  constructor(private ds: DataService) {
  }

  ngOnInit(): void {


    this.getArrayOfTimesInterval(60 / 5)
    this.getDetails(60 / 5)
  }

  getDetails(e: number) {
    this.ds.getAllData().subscribe((data: Range[]) => {
      let ranges: FilteredTimeItem[] = [];
      const timeInterval = this.getArrayOfTimesInterval(e)
      timeInterval.forEach((item, index) => {
        if (!timeInterval[index + 1]?.value || !item?.value) return
        ranges.push({
          time: timeInterval[index + 1].value,
          items: data.filter((el: any) => {
            // console.log(new Date(el.time).getHours());
            return this.convertTime(`${new Date(parseInt(el.time)).getHours()}:${new Date(parseInt(el.time)).getMinutes()}`) >= this.convertTime(item.value) &&
              this.convertTime(`${new Date(parseInt(el.time)).getHours()}:${new Date(parseInt(el.time)).getMinutes()}`) < this.convertTime(timeInterval[index + 1].value)
          })
        })
      });
      if (ranges) this.isLoading = false;
      this.ranges = ranges
    })
  }

  private convertTime(time: string) {
    const splittedTime = time.split(':');
    const hours = splittedTime[0] ? Number(splittedTime[0]) : 0;
    const mins = splittedTime[1] ? Number(splittedTime[1]) : 0;
    return hours + (mins / 60)
  }

  private getArrayOfTimesInterval(increment: number) {
    const times = [];
    for (let i = 0; i < 24; i++) {
      times.push({
        value: `${i === 0 || i - 24 === 0 ? 0 : i < 24 ? i : i - 24}:00`,
      });
      for (let j = 60 / increment; j < 60; j += 60 / increment) {
        times.push({
          value: `${i === 0 || i - 24 === 0 ? 0 : i < 24 ? i : i - 24}:${("0" + Math.ceil(j)).slice(-2) }`,
        });
      }
    }
    return times;
  };


}
