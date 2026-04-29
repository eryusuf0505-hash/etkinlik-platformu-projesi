import { Schema } from 'mongoose';

/**
 * Tüm modellerde ortak olan alanlar
 */
export const baseSchemaFields = {
  aktif_mi: { 
    type: Boolean, 
    default: true 
  },
  silindi_mi: { 
    type: Boolean, 
    default: false 
  }
};

/**
 * Tüm modellerde ortak olan ayarlar (Otomatik tarih yönetimi vb.)
 */
export const baseSchemaOptions = {
  timestamps: {
    createdAt: 'olusturulma_tarihi',
    updatedAt: 'guncellenme_tarihi'
  },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};