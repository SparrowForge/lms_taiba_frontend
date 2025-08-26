import { Column } from "@ant-design/plots";

interface ColumnGraphProps {
  data: { week: string; attendance: number }[];
  color?: string; // hex or rgba
}

const ColumnGraph: React.FC<ColumnGraphProps> = ({ data, color = "#1F4BCA" }) => {
  const config = {
    data,
    xField: "week",
    yField: "attendance",
    columnWidthRatio: 0.5, 
    intervalPadding: 20,
    columnStyle: {
      radius: [8, 8, 0, 0], // rounded top corners
      fill: color, // dynamic color
    },
   
    // label: {
    //   text: (originData: { attendance: any; }) => `${originData.attendance}%`,
    //   offset: 10,
    //   style: {
    //     fill: "#333",
    //     fontSize: 12,
    //   },
    // },
    // xAxis: {
    //   label: {
    //     style: { fontSize: 12 },
    //   },
    // },
    // yAxis: {
    //   label: {
    //     style: { fontSize: 12 },
    //   },
    // },
    legend: false,
  };

  return <Column {...config} />;
};

export default ColumnGraph;
