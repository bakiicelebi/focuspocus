import React from 'react';
import { PieChart as PieGraph } from 'react-native-gifted-charts';
import { View } from "react-native";
import { Box, Text, useColorMode } from 'native-base';
import { useTranslation } from 'react-i18next';

const PieChart = ({ type }: any) => {

    const { t, i18n } = useTranslation();
    const { colorMode } = useColorMode()

    const pieData = [
        {
            value: type ? 47 : 81,
            color: '#009FFF',
            gradientCenterColor: '#006DFF',
            focused: true,
        },
        { value: type ? 16 : 10, color: '#93FCF8', gradientCenterColor: '#3BE9DE' },
        { value: type ? 40 : 5, color: '#BDB2FA', gradientCenterColor: '#8F80F3' },
        { value: type ? 3 : 4, color: '#FFA5BA', gradientCenterColor: '#FF7F97' },
    ];

    const renderDot = (color: any) => {
        return (
            <View
                style={{
                    height: 10,
                    width: 10,
                    borderRadius: 5,
                    backgroundColor: color,
                    marginRight: 10,
                }}
            />
        );
    };

    const renderLegendComponent = () => {
        return (
            <>
                <Box
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'center',
                        marginBottom: 4,
                    }}>
                    <Box
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 120,
                            marginRight: 20,
                        }}>
                        {renderDot('#006DFF')}
                        <Text fontWeight={"semibold"} >{t('excellent')}: {type ? "47%" : "81%"}</Text>
                    </Box>
                    <Box
                        style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                        {renderDot('#8F80F3')}
                        <Text fontWeight={"semibold"} >{t('okay')}: {type ? "16%" : "10%"}</Text>
                    </Box>
                </Box>
                <Box style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Box
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: 120,
                            marginRight: 20,
                        }}>
                        {renderDot('#3BE9DE')}
                        <Text fontWeight={"semibold"} >{t('good')}: {type ? "40%" : "5%"}</Text>
                    </Box>
                    <Box
                        style={{ flexDirection: 'row', alignItems: 'center', width: 120 }}>
                        {renderDot('#FF7F97')}
                        <Text fontWeight={"semibold"} >{t('poor')}: {type ? "3%" : "4%"}</Text>
                    </Box>
                </Box>
            </>
        );
    };

    return (

        <Box shadow={"4"}
            _dark={{
                bg: "#1e1f21"
            }} _light={{
                bg: "#ffffff"
            }}
            style={{
                margin: 20,
                padding: 16,
                borderRadius: 20,
            }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {type ? t("sale statistics") : t('performance')}
            </Text>
            <Box style={{ padding: 20, alignItems: 'center' }}>
                <PieGraph
                    data={pieData}
                    donut
                    sectionAutoFocus
                    selectedIndex={2}
                    showGradient
                    radius={60}
                    innerRadius={42}
                    innerCircleColor={colorMode === "dark" ? "#1e1f21" : "#ffffff"}
                    centerLabelComponent={() => {
                        return (
                            <Box style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text
                                    style={{ fontSize: 22, fontWeight: 'bold' }}>
                                    {type ? "45" : "81"}
                                </Text>
                                <Text style={{ fontSize: 14 }}>{t('excellent')}</Text>
                            </Box>
                        );
                    }}
                />
            </Box>
            {renderLegendComponent()}
        </Box>);
}

export default PieChart;

