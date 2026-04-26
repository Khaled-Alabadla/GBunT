import { Router } from 'express';
import { detectLanguage } from '../middleware/languageDetector.js';
import { handleChat } from '../services/ragService.js';

const router = Router();

router.post('/chat', detectLanguage, handleChat);

router.get('/topics', (req, res) => {
  const topics = [
    { id: 'types', ar: 'أنواع القهوة', en: 'Coffee Types' },
    { id: 'brewing', ar: 'طرق التحضير', en: 'Brewing Methods' },
    { id: 'origins', ar: 'بلدان المنشأ', en: 'Origins' },
    { id: 'roasting', ar: 'درجات التحميص', en: 'Roasting Levels' },
    { id: 'equipment', ar: 'المعدات', en: 'Equipment' },
    { id: 'drinks', ar: 'المشروبات', en: 'Coffee Drinks' },
    { id: 'health', ar: 'الصحة والكافيين', en: 'Health & Caffeine' },
    { id: 'storage', ar: 'التخزين', en: 'Storage' },
    { id: 'specialty', ar: 'القهوة المختصة', en: 'Specialty Coffee' }
  ];
  res.json({ topics });
});

export default router;
