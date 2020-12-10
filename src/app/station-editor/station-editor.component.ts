import {Component, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Song, Station} from '../../interfaces/mount';
import {ApiCommService} from '../services/api-comm.service';

@Component({
  selector: 'app-station-editor',
  templateUrl: './station-editor.component.html',
  styleUrls: ['./station-editor.component.scss']
})
export class StationEditorComponent implements OnInit, OnChanges {
  @Input() station: Station;
  currentSong: Song;
  queue: Song[];
  queueQuery: string;

  constructor(private apiCommService: ApiCommService) {
    this.queueQuery = '';
  }

  ngOnInit(): void {
    this.apiCommService.getStationCurrentSong(this.station.name)
      .subscribe((data) => {
        this.currentSong = data;
      });
    this.getStationQueue();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.apiCommService.getStationCurrentSong(this.station.name)
      .subscribe((data) => {
        this.currentSong = data;
      });
    this.getStationQueue();
  }

  skipSong(): any {
    this.apiCommService.stationSkipSong(this.station.name)
      .subscribe(data => data);
  }

  getStationQueue(): any {
    this.apiCommService.getStationQueue(this.station.name)
      .subscribe(data => {
        this.queue = data;
      });
  }

  clearStationQueue(): any {
    this.apiCommService.clearStationQueue(this.station.name)
      .subscribe(() => {
        this.getStationQueue();
      });
  }

  addToStationQueue($event: Event): any {
    this.apiCommService.addToStationQueue(this.station.name, this.queueQuery)
      .subscribe(() => {
        this.getStationQueue();
      });
  }

  removeStation(): any {
    this.apiCommService.removeStation(this.station.name)
      .subscribe(() => {
      });
  }

}
