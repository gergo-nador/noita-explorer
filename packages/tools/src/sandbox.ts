import { imageHelpers } from './common/images.node.ts';

const base64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABOElEQVQ4jWNkwAF6d878D2MXu6cz4lLHREjzsd1HUfhEGQADDTN3o9BEG/DkwTOIxnRXFBobYEEX6Gt1/a8q8JRh3wNMA/EaEBwc/J+BgYFBVUWQ4fadhwxOKlAJUzYGBoanDP3EeMHa6BMDxBB5htt3HsIxOlhcEQ0PVEZk242YPjMwMDAwyCmLwhU/uvsawwA5ZVGG2I6ljCgugGnGpvHgHw4UGhnAw+Dm608MyOzQTB2G/M5TDCryCgx3Hj5gYIDSu85dQklUGNFo4MrLEJqpw8DAwMAwsdwMLv7p3ycGMVkhDBfATdu8MgUeMOgBt+rUb4YTGw9gTc5wL9y+85BBVUWegYGBAU7DwInqOTjzAtyAVad+M1SrYLcdH2BhYGBgsPB3+M/AwMDgG45qE0ycIMCnkJAhAPcodME5YVuaAAAAAElFTkSuQmCC';

imageHelpers.cropImageBase64(base64, { x: 1, y: 1, width: 2, height: 2 });
