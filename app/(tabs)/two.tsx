import BarChart from 'components/Dashboard/BarChart'
import { Text, View } from 'tamagui'

export default function TabTwoScreen() {
  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <BarChart />
    </View>
  )
}
