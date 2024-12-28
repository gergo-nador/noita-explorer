import Plot from 'react-plotly.js';
import noitaMap from '../assets/noita-map.webp';
import { useSave00Store } from '../stores/save00.ts';
import { StringKeyDictionary } from '@noita-explorer/model';

export const NoitaDeathMap = () => {
  const { sessions } = useSave00Store();

  if (sessions === undefined) {
    return <div>No Sessions loaded</div>;
  }

  const rangeXLeft = -17800;
  const rangeXRight = 17800;
  const rangeYTop = -24000;
  const rangeYBottom = 10050;

  const sessionsFiltered = sessions
    .map((s) =>
      s.killedByReason === undefined ? { ...s, killedByReason: 'New Game' } : s,
    )
    .filter((s) => s.deathPosX !== undefined && Math.abs(s.deathPosX) < 17800);

  const uniqueProperties = Array.from(
    new Set(sessionsFiltered.map((s) => s.killedByReason)),
  );

  const generateColor = (index, total) => {
    const hue = (index / total) * 360; // Spread hues across 360 degrees
    return `hsl(${hue}, 70%, 50%)`; // HSL color (70% saturation, 50% lightness)
  };

  const colorMap: StringKeyDictionary<string> = uniqueProperties.reduce(
    (acc, prop, index) => {
      acc[prop] = generateColor(index, uniqueProperties.length);
      return acc;
    },
    {} as StringKeyDictionary<string>,
  );

  const traces = uniqueProperties.map((prop) => ({
    x: sessions
      ?.filter((s) => s.killedByReason === prop && s.deathPosX)
      .map((s) => s.deathPosX),
    y: sessions
      ?.filter((s) => s.killedByReason === prop && s.deathPosY)
      .map((s) => -s.deathPosY), // Inverted for your specific layout
    mode: 'markers',
    marker: { size: 10, color: colorMap[prop] },
    type: 'scatter',
    name: prop, // Legend label
  }));

  const scatterData = {
    x: sessionsFiltered.map((s) => s.deathPosX),
    y: sessionsFiltered.map((s) => -s.deathPosY),
    mode: 'markers',
    marker: {
      color: sessionsFiltered
        .filter((s) => s.deathPosX)
        .map((s) => colorMap[s.killedByReason!]),
      size: 10,
    },
    type: 'scatter',
  };

  const plotSizeMultiplier = 2;

  const layout = {
    width: 531 * plotSizeMultiplier,
    height: 450 * plotSizeMultiplier,
    xaxis: {
      range: [rangeXLeft, rangeXRight],
      showgrid: false,
      zeroline: false,
      scaleanchor: 'y',
      autorange: false,
    },
    yaxis: {
      range: [rangeYTop, rangeYBottom],
      showgrid: false,
      zeroline: false,
      autorange: false,
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    images: [
      {
        source: noitaMap, // Replace with your image URL or base64
        x: rangeXLeft,
        y: rangeYBottom,
        xref: 'x',
        yref: 'y',
        sizex: Math.abs(rangeXLeft) + Math.abs(rangeXRight),
        sizey: Math.abs(rangeYTop) + Math.abs(rangeYBottom),
        xanchor: 'left',
        yanchor: 'top',
        layer: 'below',
      },
    ],
    showlegend: true,
    /* plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',*/
  };

  return (
    <div>
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true }}
        style={{ padding: 0, margin: 0 }}
      />
    </div>
  );
};
