import { z } from 'zod';

export const EventCreateSchema = z.object({
  title: z.string().min(3, "Başlık en az 3 karakter olmalıdır"),
  category: z.string().min(2, "Kategori zorunludur"),
  date: z.string().min(1, "Tarih zorunludur"),
  time: z.string().min(1, "Saat zorunludur"),
  location: z.string().min(2, "Şehir zorunludur"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır")
});