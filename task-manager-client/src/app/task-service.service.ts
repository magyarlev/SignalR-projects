import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Task } from './interfaces';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root',
})
export class TaskServiceService {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5152/hub')
    .build();
  private _taskSubject: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>(
    []
  );
  tasks$: Observable<Task[]> = this._taskSubject.asObservable();
  constructor() {
    this.connection
      .start()
      .then(() => {
        console.log('SignalR connection established');
      })
      .catch((err) => {
        console.error('Error establishing SignalR connection', err);
      });
    this.connection.on('TaskCreated', (task: Task) => {
      this._taskSubject.next([...this._taskSubject.value, task]);
    });
    this.connection.on('TaskUpdated', (task: Task) => {
      const taskToUpdateIndex = this._taskSubject.value.findIndex((t) => {
        t.Id === task.Id;
      });
      this._taskSubject.value[taskToUpdateIndex] = task;
      this._taskSubject.next(this._taskSubject.value);
    });
    this.connection.on('TaskDeleted', (taskId: string) => {
      const taskToUpdateIndex = this._taskSubject.value.findIndex((t) => {
        t.Id === taskId;
      });
      this._taskSubject.value.splice(taskToUpdateIndex, 1);
      this._taskSubject.next(this._taskSubject.value);
    });
    this.connection.on('ReceiveTasks', (tasks: Task[]) => {
      this._taskSubject.next(tasks);
    });
  }

  createTask(task: Task) {
    this.connection.invoke('CreateTask', task);
  }
  updateTask(task: Task) {
    this.connection.send('UpdateTask', task);
  }
  deleteTask(taskId: Task['Id']) {
    this.connection.send('DeleteTask', taskId);
  }
  getAllTasks() {
    this.connection.invoke('GetAllTasks');
  }
}
