import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { Credentials } from '~/components/auth/credentials'

export default function Screen() {
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.main}>
      <Credentials />
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  main: {
    backgroundColor: theme.colors.gray[1],
    flex: 1,
    padding: theme.space[4],
  },
}))
