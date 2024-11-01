/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get } from '@nestjs/common';
import axios from 'axios';

@Controller('localizacao')
export class LocationController {
  private currentLocation: { latitude: number; longitude: number; address?: string } | null = null;

  @Post('update') // Rota para atualizar a localização
  async updateLocation(@Body() body: { latitude: number; longitude: number }) {
    const { latitude, longitude } = body;

    try {
      // Salvar a localização atual
      this.currentLocation = { latitude, longitude };

      // Obter o endereço usando a API do Nominatim (OpenStreetMap)
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      const address = response.data.display_name || 'Endereço não encontrado';
      this.currentLocation.address = address;

      return this.currentLocation;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao obter a localização.');
    }
  }

  @Get('current') // Rota para obter a localização atual
  getCurrentLocation() {
    if (this.currentLocation) {
      return this.currentLocation;
    } else {
      return { message: 'Localização não disponível' };
    }
  }
}




