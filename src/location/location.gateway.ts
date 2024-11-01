/* eslint-disable prettier/prettier */
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite conexão de qualquer domínio
  },
})
export class LocationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Método executado quando um cliente se conecta
  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  // Método executado quando um cliente se desconecta
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  // Receber as coordenadas do cliente em tempo real
  @SubscribeMessage('sendLocation')
  handleLocationUpdate(client: Socket, location: { lat: number; lng: number }): void {
    console.log(`Received location from client ${client.id}:`, location);

    // Broadcast para todos os outros clientes conectados
    this.server.emit('locationUpdate', {
      clientId: client.id,
      location,
    });
  }
}
