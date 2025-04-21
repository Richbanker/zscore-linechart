import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  DotProps,
} from 'recharts';

interface DotPropsWithIndex extends DotProps {
  index?: number;
}

const rawData = [
  { name: 'Page A', uv: 4000, pv: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398 },
  { name: 'Page C', uv: 2000, pv: 9800 },
  { name: 'Page D', uv: 2780, pv: 3908 },
  { name: 'Page E', uv: 1890, pv: 4800 },
  { name: 'Page F', uv: 2390, pv: 3800 },
  { name: 'Page G', uv: 3490, pv: 4300 },
];

const getZScoreData = (data: typeof rawData, key: keyof typeof rawData[0]) => {
  const values = data.map((d) => d[key] as number);
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const stdDev = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length);

  return data.map((item) => {
    const value = item[key] as number;
    const z = (value - mean) / stdDev;
    const color = Math.abs(z) > 1 ? 'red' : key === 'pv' ? '#8884d8' : '#82ca9d';
    return {
      ...item,
      [`${key}_z`]: z,
      [`${key}_color`]: color,
    };
  });
};

const getSegmentsByZScore = (
  data: typeof rawData,
  key: keyof typeof rawData[0],
  colorNormal: string,
  colorAbnormal: string
) => {
  const segments: { data: any[]; stroke: string }[] = [];
  let currentSegment: any[] = [];
  let currentColor = '';

  for (let i = 0; i < data.length - 1; i++) {
    const pointA = data[i];
    const pointB = data[i + 1];
  
    const zA = Math.abs((pointA as any)[`${key}_z`]);
    const zB = Math.abs((pointB as any)[`${key}_z`]);
  
    const isAbnormal = zA > 1 && zB > 1;
    const stroke = isAbnormal ? colorAbnormal : colorNormal;
  
    const pointAKey = `${key}-${i}-A`;
    const pointBKey = `${key}-${i}-B`;
  
    // начинаем новый сегмент, если цвет поменялся
    if (stroke !== currentColor && currentSegment.length > 0) {
      segments.push({ data: currentSegment, stroke: currentColor });
      currentSegment = [{ ...pointA, __pointKey: pointAKey }];
    } else if (currentSegment.length === 0) {
      currentSegment.push({ ...pointA, __pointKey: pointAKey });
    }
  
    currentSegment.push({ ...pointB, __pointKey: pointBKey });
    currentColor = stroke;
  }
  
  if (currentSegment.length > 1) {
    segments.push({ data: currentSegment, stroke: currentColor });
  }

  return segments;
};

const data = getZScoreData(getZScoreData(rawData, 'uv'), 'pv');

const renderCustomDot = (key: string) => {
  return (props: DotProps): React.ReactElement<SVGElement> => {
    const { cx, cy } = props;
    const index = (props as DotPropsWithIndex).index ?? 0;

    const point = data[index] as any;
    const color = point[`${key}_color`] || '#000';
    const dotKey = point.__pointKey || `${key}-dot-${index}`;

    return <circle key={dotKey} cx={cx} cy={cy} r={4} stroke={color} fill={color} />;
  };
};

export default function ZScoreChart() {
  const segmentsPv = getSegmentsByZScore(data, 'pv', '#8884d8', 'red');
  const segmentsUv = getSegmentsByZScore(data, 'uv', '#82ca9d', 'red');

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />

        {segmentsPv.map((segment, i) => (
          <Line
            key={`pv-line-${i}`}
            type="monotone"
            data={segment.data}
            dataKey="pv"
            stroke={segment.stroke}
           dot={renderCustomDot('pv')}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}

        {segmentsUv.map((segment, i) => (
          <Line
            key={`uv-line-${i}`}
            type="monotone"
            data={segment.data}
            dataKey="uv"
            stroke={segment.stroke}
           dot={renderCustomDot('uv')}
            strokeWidth={2}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
