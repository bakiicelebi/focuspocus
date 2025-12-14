import React, { useEffect } from 'react';
import { Easing } from 'react-native';
import { Box, Text } from 'native-base';
import AnimatedNumbers from 'react-native-animated-numbers';
import { useTranslation } from 'react-i18next';

const NumberChart = ({ type }: any) => {
    const [animateToNumber, setAnimateToNumber] = React.useState(0);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (type) {
                setAnimateToNumber(571)
            }
            else {
                setAnimateToNumber(1401)
            }
        }, 800);

        return () => clearTimeout(timer); // Komponentten çıkıldığında zamanlayıcıyı temizle
    }, []);

    return (
        <Box
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <AnimatedNumbers
                includeComma
                animationDuration={2500}
                easing={Easing.out(Easing.exp)}
                animateToNumber={animateToNumber}
                fontStyle={{ fontSize: 35, fontWeight: '900', color: "#ea7465" }}
            />
            <Text _dark={{ color: "#a0a1a1" }} fontSize={"xl"} >
                {type ? t("sale number") : t("total") + " " + t('product')}
            </Text>
        </Box>
    );
};
export default NumberChart;