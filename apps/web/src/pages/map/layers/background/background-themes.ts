/**
 * from data/weather_gfx/parallax_colors_main_menu.bmp
 */
export const noitaBgThemes: Record<
  'day' | 'sunset' | 'night' | 'sunrise',
  NoitaBackgroundTheme
> = {
  day: {
    background: '#58a8d4',
    cloud1: '#d6e4e9',
    cloud2: '#aec2d2',
    mountain1Highlight: '#d6e4e9',
    mountain1Back: '#445b89',
    mountain2: '#7499b8',
  },
  sunset: {
    background: '#e1974c',
    cloud1: '#f8cfa9',
    cloud2: '#e0b58b',
    mountain1Highlight: '#96785b',
    mountain1Back: '#836757',
    mountain2: '#926b45',
  },
  night: {
    background: '#31253a',
    cloud1: '#42415a',
    cloud2: '#383c52',
    mountain1Highlight: '#292e43',
    mountain1Back: '#242534',
    mountain2: '#1a1926',
    hasStars: true,
  },
  sunrise: {
    background: '#e290a8',
    cloud1: '#eccbb7',
    cloud2: '#e4b39d',
    mountain1Highlight: '#d88282',
    mountain1Back: '#ba6d8f',
    mountain2: '#dc957f',
  },
};

export interface NoitaBackgroundTheme {
  background: string;
  mountain1Highlight: string;
  mountain1Back: string;
  cloud1: string;
  cloud2: string;
  mountain2: string;
  hasStars?: boolean;
}
