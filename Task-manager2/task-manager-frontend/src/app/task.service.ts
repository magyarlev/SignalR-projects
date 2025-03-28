import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../types';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5152/taskHub')
    .build();
  #taskSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.#taskSubject.asObservable();

  constructor() {
    this.connection
      .start()
      .then(() => {
        console.log('SignalR connection established');
      })
      .catch((err) => {
        console.error('Error establishing SignalR connection', err);
      });
  }
}
