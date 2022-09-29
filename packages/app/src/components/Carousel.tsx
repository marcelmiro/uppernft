import * as React from 'react'
import {
	StyleSheet,
	Dimensions,
	FlatList,
	FlatListProps,
	StyleProp,
	ViewStyle,
} from 'react-native'

import Colors from '@app/constants/Colors'
import { View } from '@app/components/Themed'

type Required<T extends Record<string, unknown>> = {
	[K in keyof T]: NonNullable<T[K]>
}

interface CarouselProps<ItemT = any>
	extends Required<
		Pick<FlatListProps<ItemT>, 'data' | 'renderItem' | 'keyExtractor'>
	> {
	containerStyle?: StyleProp<ViewStyle>
}

type OnScrollEvent = Parameters<NonNullable<FlatListProps<any>['onScroll']>>[0]

const width = Dimensions.get('window').width

function SlideComponent({ children }: React.PropsWithChildren) {
	return <View style={styles.slideContainer}>{children}</View>
}

export default function Carousel<ItemT = any>({
	data,
	renderItem,
	keyExtractor,
	containerStyle,
}: CarouselProps<ItemT>) {
	const [index, setIndex] = React.useState(0)

	function onScroll(e: OnScrollEvent) {
		const newIndex = Math.round(e.nativeEvent.contentOffset.x / width)
		setIndex(newIndex)
	}

	return (
		<View style={[styles.container, containerStyle]}>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={keyExtractor}
				horizontal
				decelerationRate="normal"
				disableIntervalMomentum
				showsHorizontalScrollIndicator={false}
				snapToInterval={width}
				snapToAlignment="start"
				CellRendererComponent={SlideComponent}
				onScroll={onScroll}
			/>

			<View style={styles.dotContainer}>
				{[...Array(data.length).keys()].map((i) => (
					<View
						key={i}
						style={[styles.dot, i === index && styles.dotActive]}
					/>
				))}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {},
	slideContainer: {
		width,
	},
	dotContainer: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center',
	},
	dot: {
		width: 8,
		height: 8,
		borderRadius: 8,
		marginHorizontal: 6,
		marginVertical: 2,
		backgroundColor: Colors.primary200,
	},
	dotActive: {
		backgroundColor: Colors.accent,
	},
})
