import React from "react";
import { BarChart as BarGraph } from "react-native-gifted-charts";
import { Stack, Text } from "tamagui";

const BarChart = () => {
  const data = [
    { value: 150, label: "Mon" },
    { value: 200, label: "Tue" },
    { value: 250, label: "Wed" },
    { value: 100, label: "Thu" },
    { value: 250, label: "Fri" },
    { value: 300, label: "Sat" },
    { value: 400, label: "Sun" },
  ];

  return (
    <Stack
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack>
        <BarGraph
          data={data}
          barWidth={20}
          initialSpacing={10}
          spacing={20}
          barBorderTopLeftRadius={10}
          barBorderTopRightRadius={10}
          xAxisType={"solid"}
          rulesColor={"#7f8183"}
          rulesThickness={1}
          xAxisColor={"#7f8183"}
          xAxisThickness={2}
          yAxisColor={"#7f8183"}
          yAxisThickness={2}
          yAxisTextStyle={{ color: "gray" }}
          stepValue={100}
          maxValue={600}
          noOfSections={6}
          yAxisLabelTexts={["0", "100", "200", "300", "400", "500", "600"]}
          labelWidth={40}
          xAxisLabelTextStyle={{
            color: "gray",
            textAlign: "center",
          }}
          showLine
          lineConfig={{
            isAnimated: false,
            color: "#ea7465",
            thickness: 3,
            curved: true,
            hideDataPoints: true,
            shiftY: 20,
            initialSpacing: -5,
          }}
          renderTooltip={(item: any, index: any) => {
            return (
              <Stack
                style={{
                  marginBottom: 20,
                  marginLeft: -8,
                  backgroundColor: "#ffcefe",
                  paddingHorizontal: 6,
                  paddingVertical: 4,
                  borderRadius: 4,
                  position: "absolute",
                }}
              >
                <Text>{item.value}</Text>
              </Stack>
            );
          }}
        />
      </Stack>
    </Stack>
  );
};

export default BarChart;
