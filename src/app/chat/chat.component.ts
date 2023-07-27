import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebsocketService } from '../websocket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  messages: { username: string; message: string }[] = [];
  message!: string;
  username!: string;

  constructor(private websocketService: WebsocketService) {}

  ngOnInit() {
    this.websocketService
      .connect('ws://localhost:8080') // Replace with your WebSocket server URL
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        const { username, message } = JSON.parse(data);
        this.messages.push({ username, message });
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  sendMessage() {
    if (this.message && this.username) {
      this.websocketService.sendMessage(this.username, this.message);
      this.message = '';
    }
  }
}