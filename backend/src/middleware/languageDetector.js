import { franc } from 'franc-min';

export function detectLanguage(req, res, next) {
  const message = req.body.message || '';
  const detected = franc(message);
  const lang = detected === 'ara' ? 'ar' : 'en';
  req.detectedLanguage = req.body.language === 'auto' || !req.body.language ? lang : req.body.language;
  next();
}
