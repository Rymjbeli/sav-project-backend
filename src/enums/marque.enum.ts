import { registerEnumType } from '@nestjs/graphql';

export enum MarqueEnum {
  BMW = 'BMW',
  MERCEDES = 'MERCEDES',
  AUDI = 'AUDI',
  VOLKSWAGEN = 'VOLKSWAGEN',
  PEUGEOT = 'PEUGEOT',
  RENAULT = 'RENAULT',
  CITROEN = 'CITROEN',
  FORD = 'FORD',
  TOYOTA = 'TOYOTA',
  NISSAN = 'NISSAN',
  KIA = 'KIA',
  HYUNDAI = 'HYUNDAI',
  MAZDA = 'MAZDA',
  VOLVO = 'VOLVO',
  JEEP = 'JEEP',
  SUZUKI = 'SUZUKI',
  HONDA = 'HONDA',
  FIAT = 'FIAT',
  CHEVROLET = 'CHEVROLET',
  DODGE = 'DODGE',
  JAGUAR = 'JAGUAR',
  LAND_ROVER = 'LAND_ROVER',
  MASERATI = 'MASERATI',
  MINI = 'MINI',
  MITSUBISHI = 'MITSUBISHI',
  PORSCHE = 'PORSCHE',
  SEAT = 'SEAT',
  SKODA = 'SKODA',
  SMART = 'SMART',
  SSANGYONG = 'SSANGYONG',
  SUBARU = 'SUBARU',
  TESLA = 'TESLA',
  ALFA_ROMEO = 'ALFA_ROMEO',
  ASTON_MARTIN = 'ASTON_MARTIN',
  BENTLEY = 'BENTLEY',
  BUGATTI = 'BUGATTI',
  CADILLAC = 'CADILLAC',
  CHERY = 'CHERY',
  DAIHATSU = 'DAIHATSU',
  FERRARI = 'FERRARI',
  INFINITI = 'INFINITI',
  LAMBORGHINI = 'LAMBORGHINI',
  LANCIA = 'LANCIA',
  LOTUS = 'LOTUS',
  LEXUS = 'LEXUS',
  MCLAREN = 'MCLAREN',
  ROLLS_ROYCE = 'ROLLS_ROYCE',
  AUTRES = 'AUTRES',
}

registerEnumType(MarqueEnum, {
  name: 'Marque',
});
