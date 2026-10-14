import { SiteConfig } from '../models/index.js';

const DEFAULT_KEY = 'frontend';

// 1. Obtener la configuración pública del sitio
export const getSiteConfig = async (req, res) => {
  try {
    const row = await SiteConfig.findByPk(DEFAULT_KEY);
    res.json(row ? row.config : {});
  } catch (error) {
    console.error('Error fetching site config:', error);
    res.status(500).json({ message: 'Error al obtener la configuración del sitio' });
  }
};

// 2. Guardar/actualizar la configuración (Solo Admins)
export const upsertSiteConfig = async (req, res) => {
  try {
    const [row, created] = await SiteConfig.upsert({
      key: DEFAULT_KEY,
      config: req.body
    }, { returning: true });

    res.status(created ? 201 : 200).json({
      message: 'Configuración guardada y publicada',
      config: row.config
    });
  } catch (error) {
    console.error('Error saving site config:', error);
    res.status(500).json({ message: 'Error al guardar la configuración del sitio' });
  }
};
