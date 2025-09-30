import { Column } from '@ant-design/plots';

interface ColumnGraphProps {
  data: { xdata: string; ydata: number; color: string }[];
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({ data }) => {
  const config = {
    data,
    xField: 'xdata',
    yField: 'ydata',
    columnWidthRatio: 0.5,
    intervalPadding: 20,
    columnStyle: {
      radius: [8, 8, 0, 0],
    },
    colorField: 'color', // 🔹 tell Column to look at "color"
    color: (d: any) => d.color, // 🔹 apply color from dataset
    legend: false,
  };

  return <Column {...config} />;
};

export default ColumnGraph;
