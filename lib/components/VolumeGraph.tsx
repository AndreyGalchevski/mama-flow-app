import { format, subDays } from 'date-fns';
import { memo } from 'react';
import { View } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

import { AccessibilityLabels } from '../accessibility';
import { COLORS } from '../colors';
import { useLogsStore } from '../hooks/useLogsStore';

function VolumeGraph() {
  const logs = useLogsStore((s) => s.logs);

  const days = [...Array(7)].map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return format(d, 'yyyy-MM-dd');
  });

  const volumeByDay = days.map((day) => {
    const total = logs
      .filter((log) => format(log.timestamp, 'yyyy-MM-dd') === day)
      .reduce((sum, log) => sum + log.volumeTotalML, 0);
    return { date: day, volumeTotalML: total };
  });

  return (
    <View
      style={{
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: COLORS.outline,
        backgroundColor: COLORS.background,
        padding: 8,
      }}
      accessible={true}
      accessibilityLabel={AccessibilityLabels.volumeChart}
      accessibilityRole="image"
    >
      <LineChart
        data={volumeByDay.map((it) => ({
          value: it.volumeTotalML,
          label: format(new Date(it.date), 'EEE'),
          dataPointText: `${it.volumeTotalML}ml`,
        }))}
        width={300}
        height={200}
        spacing={40}
        initialSpacing={20}
        color={COLORS.primary}
        thickness={3}
        startFillColor={COLORS.primary}
        endFillColor={COLORS.background}
        startOpacity={0.3}
        endOpacity={0.1}
        areaChart
        curved
        isAnimated
        animateOnDataChange
        animationDuration={1000}
        dataPointsHeight={8}
        dataPointsWidth={8}
        dataPointsColor={COLORS.primary}
        dataPointsRadius={4}
        textColor={COLORS.onSurface}
        textFontSize={12}
        hideRules
        showVerticalLines
        verticalLinesColor={COLORS.surfaceVariant}
        verticalLinesThickness={1}
        verticalLinesStrokeDashArray={[2, 6]}
        xAxisThickness={2}
        xAxisColor={COLORS.surfaceVariant}
        yAxisThickness={0}
        yAxisTextStyle={{ color: COLORS.onSurfaceVariant, fontSize: 11 }}
        xAxisLabelTextStyle={{ color: COLORS.onSurfaceVariant, fontSize: 11 }}
        rulesColor={COLORS.surfaceVariant}
        backgroundColor={COLORS.background}
        noOfSections={4}
        maxValue={Math.max(...volumeByDay.map((d) => d.volumeTotalML)) * 1.1 || 100}
        focusEnabled
        showDataPointOnFocus
        showStripOnFocus
        showTextOnFocus
        textShiftY={-8}
        textShiftX={-10}
        textColor1={COLORS.primary}
        textFontSize1={14}
        stripHeight={200}
        stripWidth={0.5}
        stripColor={COLORS.primary}
        stripOpacity={0.3}
        focusedDataPointColor={COLORS.secondary}
        focusedDataPointRadius={6}
      />
    </View>
  );
}

export default memo(VolumeGraph);
