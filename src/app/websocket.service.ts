import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private socket!: WebSocket;

  constructor() {}

  public connect(url: string): Observable<any> {
    this.socket = new WebSocket(url);

    return new Observable(observer => {
      this.socket.onmessage = (event) => {
        observer.next(event.data);
      };
      this.socket.onerror = (event) => observer.error(event);
      this.socket.onclose = () => observer.complete();
    });
  }

  public sendMessage(username: string, message: string): void {
    this.socket.send(JSON.stringify({ username, message }));
  }

  public closeConnection(): void {
    this.socket.close();
  }
}