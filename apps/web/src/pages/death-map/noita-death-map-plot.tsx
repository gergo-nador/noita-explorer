import ReactPlotly from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';

interface Props {
  traces: Data[];
  layout: Partial<Layout>;
}

const NoitaDeathMapPlot = ({ traces, layout }: Props) => {
  return (
    <ReactPlotly
      data={traces}
      layout={layout}
      config={{ responsive: true }}
      style={{ padding: 0, margin: 0, width: '100%', height: '700px' }}
    />
  );
};

export default NoitaDeathMapPlot;
