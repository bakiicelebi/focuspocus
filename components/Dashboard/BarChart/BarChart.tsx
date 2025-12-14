import React from "react";
import { BarChart as BarGraph } from "react-native-gifted-charts";
import { Stack, Text } from "tamagui";

const BarChart = () => {
  // const data = [
  //   {
  //     value: 250,
  //     frontColor: "#006DFF",
  //     gradientColor: "#009FFF",
  //     spacing: 6,
  //     label: t("jan"),
  //   },
  //   { value: 240, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

  //   {
  //     value: 350,
  //     frontColor: "#006DFF",
  //     gradientColor: "#009FFF",
  //     spacing: 6,
  //     label: t("feb"),
  //   },
  //   { value: 300, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

  //   {
  //     value: 450,
  //     frontColor: "#006DFF",
  //     gradientColor: "#009FFF",
  //     spacing: 6,
  //     label: t("mar"),
  //   },
  //   { value: 400, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

  //   {
  //     value: 520,
  //     frontColor: "#006DFF",
  //     gradientColor: "#009FFF",
  //     spacing: 6,
  //     label: t("apr"),
  //   },
  //   { value: 490, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },

  //   {
  //     value: 300,
  //     frontColor: "#006DFF",
  //     gradientColor: "#009FFF",
  //     spacing: 6,
  //     label: t("may"),
  //   },
  //   { value: 280, frontColor: "#3BE9DE", gradientColor: "#93FCF8" },
  // ];

  const data = [
    { value: 150, label: "Jan" },
    { value: 200, label: "Feb" },
    { value: 250, label: "Mar" },
    { value: 100, label: "Apr" },
    { value: 250, label: "May" },
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
