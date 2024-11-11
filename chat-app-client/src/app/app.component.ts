import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'chat-app-client';
  messages: string[] = [];
  messageInput: string = '';
  userName: string = this.getRandomUserName();
  connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5188/hub')
    .build();

  ngOnInit() {
    this.connection.on(
      'messageReceived',
      (username: string, message: string) => {
        this.messages.push(`${username}: ${message}`);
      }
    );
    this.connection
      .start()
      .then(() => {
        console.log('SignalR connection established');
      })
      .catch((err) =>
        console.error('Error establishing SignalR connection', err)
      );
  }

  sendMessage() {
    this.connection
      .send('NewMessage', this.userName, this.messageInput)
      .then(() => (this.messageInput = ''));
  }

  getRandomUserName() {
    const rnd = Math.random();
    if (rnd < 0.3) {
      return 'Béla';
    } else if (rnd < 0.7) {
      return 'Gizi';
    } else {
      return 'Jóska';
    }
  }
}
