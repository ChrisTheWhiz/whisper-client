import {Component, OnInit} from '@angular/core';
import {NewStationForm, ServerStatus, Station} from '../../interfaces/mount';
import {ApiCommService} from '../services/api-comm.service';
import {environment} from '../../environments/environment';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss']
})

export class ControlPanelComponent implements OnInit {
  // Used for managing state of radio stations
  serverStatus: ServerStatus;
  currentStation: Station;

  // This is the HTMLAudioElement used for playing any station
  player: HTMLAudioElement;

  // Used for unmuting using the button
  previousVolume: number;

  // Used for keeping the same volume on all stations
  // Default volume is .5
  volume = .5;

  socket: WebSocketSubject<ServerStatus>;

  newStationForm: NewStationForm;

  constructor(private apiService: ApiCommService) {
  }

  ngOnInit(): void {
    this.player = new Audio();
    this.player.volume = this.volume;
    this.player.autoplay = true;
    // TODO move socket code to ApiCommService
    this.socket = webSocket<ServerStatus>(environment.socketUrl);
    this.socket.asObservable().subscribe((data) => {
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        this.serverStatus = data;
        if (this.currentStation && Object.keys(data).includes(this.currentStation?.name || '')) {
          /* forcefully update this variable
             so that components that depend on it
             are updated as well
           */
          this.currentStation = data[this.currentStation.name];
        } else {
          // TODO make this depend on wheter we are in production
          this.setNewCurrentStation(Object.values(data)[0]);
        }
      },
      (error) => {
        console.log('error');
        console.log(error);
      },
      () => {
        console.log('complete');
      });
    // TODO make initialization depend on environment
    this.newStationForm = {
      stationName: 'lol',
      query: null,
      genre: 'various',
      mount: '/angular',
      description: 'Testing stations from angular',
    };
  }


  setNewCurrentStation(newCurrentStation: Station): void {
    this.currentStation = newCurrentStation;
    this.player.setAttribute('src', environment.radioBaseUrl + newCurrentStation.mount);
    this.player.load();
  }

  setVolume(newVolume: number): void {
    console.log(`New volume is ${newVolume}`);
    this.previousVolume = this.volume;
    this.volume = newVolume;
    this.player.volume = newVolume;
  }

  toggleMute(): void {
    if (this.volume > .01) {
      this.setVolume(0);
    } else {
      this.setVolume(this.previousVolume);
    }
  }

  getStationsAsArray(): Station[] {
    if (this.serverStatus) {
      return Object.values(this.serverStatus);
    } else {
      return [];
    }
  }

  createStation($event: Event): void {
    this.apiService.startNewStation(this.newStationForm)
      .subscribe(newStation => {
        this.setNewCurrentStation(newStation);
      });
  }
}
