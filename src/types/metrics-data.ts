export type MetricsData = {
  cpuMetric: {
    timestamps: Date[];
    values: number[];
  };
  networkInMetric: {
    timestamps: Date[];
    values: number[];
  };
  networkOutMetric: {
    timestamps: Date[];
    values: number[];
  };
  memoryUsedPercentMetric: {
    timestamps: Date[];
    values: number[];
  };
};
