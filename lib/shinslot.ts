export type Service = { id: string; name: string; description: string; price: number; duration: number; icon: string; inspection?: boolean; enabled: boolean };
export type Config = { name: string; tagline: string; address: string; phone: string; mapUrl: string; heroUrl: string; theme: 'graphite'|'navy'|'light'; posts: number; buffer: number; mode: 'request'|'instant'; open: string; close: string; workDays: number[]; closedDates: string[]; services: Service[]; diameterFactor: Record<string, number>; suvExtra: number; runflatExtra: number; }; 
export const defaultConfig: Config = {
  name: 'ШинСлот', tagline: 'Шины в порядке. Время под контролем.', address: 'Москва, ул. Автомоторная, 7', phone: '+7 (999) 123-45-67', mapUrl: 'https://yandex.ru/maps/',
  heroUrl: '/hero-blue.jpg', theme: 'navy', posts: 2, buffer: 10, mode: 'request', open: '09:00', close: '21:00', workDays: [1,2,3,4,5,6,0], closedDates: [],
  diameterFactor: {'13': 0.8, '14': 0.9, '15': 1, '16': 1.15, '17': 1.3, '18': 1.5, '19': 1.7, '20': 1.95, '21': 2.2, '22': 2.5}, suvExtra: 500, runflatExtra: 800,
  services: [
    {id:'season', name:'Сезонная смена шин', description:'Демонтаж, монтаж и балансировка четырёх колёс', price:2400, duration:60, icon:'wheel', enabled:true},
    {id:'balance', name:'Балансировка', description:'Точная балансировка комплекта из четырёх колёс', price:1600, duration:40, icon:'balance', enabled:true},
    {id:'repair', name:'Ремонт прокола', description:'Осмотр, ремонт и проверка герметичности', price:900, duration:30, icon:'repair', inspection:true, enabled:true},
    {id:'storage', name:'Хранение шин', description:'Безопасное сезонное хранение вашего комплекта', price:3200, duration:20, icon:'storage', enabled:true},
  ]
};
export type Booking = { id:string; serviceId:string; serviceName:string; wheelSize:number; vehicleType:string; addOns:string[]; price:number; startsAt:string; endsAt:string; post:number; name:string; phone:string; status:string; cancelToken?:string; createdAt:string };
export function priceFor(config:Config, service:Service, size:number, vehicle:string, runflat:boolean) { return Math.round((service.price * (config.diameterFactor[String(size)] ?? 1) + (vehicle==='suv'?config.suvExtra:0) + (runflat?config.runflatExtra:0))/50)*50; }
export function money(value:number) { return new Intl.NumberFormat('ru-RU').format(value) + ' ₽'; }
export function duration(config:Config, service:Service) { return service.duration + config.buffer; }
