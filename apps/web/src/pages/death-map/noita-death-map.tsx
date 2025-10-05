import { useSave00Store } from '../../stores/save00.ts';
import { StringKeyDictionary } from '@noita-explorer/model';
import { Data, Layout } from 'plotly.js';
import { arrayHelpers } from '@noita-explorer/tools';
import { lazy } from 'react';

const NoitaDeathMapPlot = lazy(() => import('./noita-death-map-plot.tsx'));

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

  const uniqueProperties: string[] = arrayHelpers.unique(
    sessionsFiltered
      .map((s) => s.killedByReason)
      .filter((s) => s !== undefined),
  );

  const generateColor = (index: number, total: number) => {
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

  const traces: Data[] = uniqueProperties.map((prop) => ({
    x: sessionsFiltered
      .filter((s) => s.killedByReason === prop && s.deathPosX)
      .map((s) => s.deathPosX),
    y: sessionsFiltered
      .filter((s) => s.killedByReason === prop && s.deathPosY)
      .map((s) => -s.deathPosY), // Inverted for your specific layout
    mode: 'markers',
    marker: { size: 10, color: colorMap[prop] },
    type: 'scatter',
    name: prop, // Legend label
  }));
  traces.sort((t1, t2) =>
    t1.name === undefined || t2.name === undefined
      ? 0
      : t1.name.localeCompare(t2.name),
  );

  const layout: Partial<Layout> = {
    xaxis: {
      range: [rangeXLeft, rangeXRight],
      showgrid: false,
      zeroline: false,
      scaleanchor: 'y',
      autorange: true,
    },
    yaxis: {
      range: [rangeYTop, rangeYBottom],
      showgrid: false,
      zeroline: false,
      autorange: true,
    },
    margin: { l: 0, r: 0, t: 0, b: 0 },
    images: [
      {
        source: '/images/noita-map.webp',
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
    autosize: true,

    plot_bgcolor: '#FFFFFF10',
    paper_bgcolor: '#FFFFFF05',
    legend: {
      font: {
        color: '#EEEEEE',
      },
    },

    showlegend: false,
    updatemenus: [
      {
        type: 'buttons',
        buttons: [
          {
            label: 'Legend',
            method: 'relayout',
            args: ['showlegend', false],
            args2: ['showlegend', true],
          },
        ],
      },
    ],
  };

  return (
    <div>
      {!__SSG__ && <NoitaDeathMapPlot traces={traces} layout={layout} />}
    </div>
  );
};
