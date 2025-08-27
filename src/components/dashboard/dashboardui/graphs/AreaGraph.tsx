// AreaGraph.tsx
import { Area, AreaConfig } from "@ant-design/plots";

export interface AreaGraphProps {
  data: { week: string; score: number }[];
}

const AreaGraph: React.FC<AreaGraphProps> = ({ data }) => {
  const config: AreaConfig = {
    data,
    xField: "week",
    yField: "score",
    height: 200,
    shapeField: "smooth", // smooth curve
    style: {
      fill: "l(270) 0:#ffffff 1:#3b82f6", // gradient fill
    },
    axis: {
      y: {
        nice: false,
        min: 0,
        max: 100,
        tickInterval: 10,
        labelFormatter: (val: number) => `${val}`,
      },
    },
    line: {
      style: {
        stroke: "#3b82f6",
        strokeWidth: 2,
      },
    },
    point: {
      size: 4,
      shape: "circle",
      style: {
        fill: "#3b82f6",
        stroke: "#fff",
        lineWidth: 1,
      },
    },
    tooltip: {
      showMarkers: true,
    },
  };

  return <Area {...config} />;
};

export default AreaGraph;
