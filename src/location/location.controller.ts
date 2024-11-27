/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Controller('localizacao')
export class LocationController {
  private currentLocation: { 
    latitude: number; 
    longitude: number; 
    address?: string; 
    bairro?: string; 
    cidade?: string; 
    cep?: string; 
  } | null = null;

  /**
   * Atualiza a localização com latitude e longitude fornecidas.
   */
  @Post('update') // Rota para atualizar a localização
  async updateLocation(@Body() body: { latitude: number; longitude: number }) {
    const { latitude, longitude } = body;

    try {
      // Salvar as coordenadas da localização atual
      this.currentLocation = { latitude, longitude };

      // Fazer a requisição à API do Nominatim para geocodificação reversa
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
      );

      const data = response.data;
      const addressDetails = data.address || {};

      // Extraindo informações específicas do endereço
      const rua = addressDetails.road || 'Rua não encontrada';
      const numero = addressDetails.house_number || 'Número não encontrado';
      const bairro = addressDetails.suburb || 'Bairro não encontrado';
      const cidade = addressDetails.city || addressDetails.town || addressDetails.village || 'Cidade não encontrada';
      const cep = addressDetails.postcode || 'CEP não encontrado';

      // Atualizar a localização atual com o endereço completo
      this.currentLocation = {
        ...this.currentLocation,
        address: `${rua}, ${numero}`,
        bairro,
        cidade,
        cep,
      };

      return {
        message: 'Localização atualizada com sucesso',
        location: this.currentLocation,
      };
    } catch (error) {
      console.error('Erro ao obter a localização:', error.message);
      throw new HttpException(
        'Erro ao processar a localização. Verifique as coordenadas ou a disponibilidade do serviço.',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  /**
   * Retorna a localização atual salva no sistema.
   */
  @Get('current') // Rota para obter a localização atual
  getCurrentLocation() {
    if (this.currentLocation) {
      const { latitude, longitude, address, bairro, cidade, cep } = this.currentLocation;
      return { latitude, longitude, address, bairro, cidade, cep };
    } else {
      return { message: 'Localização não disponível' };
    }
  }
}

