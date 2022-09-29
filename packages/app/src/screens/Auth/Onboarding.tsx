import * as React from 'react'
import { StyleSheet } from 'react-native'
import { SvgProps } from 'react-native-svg'

import { AuthStackScreenProps } from '@app/navigation/types'
import Colors from '@app/constants/Colors'
import { onboarding } from '@app/constants/Data'
import {
	Text,
	View,
	Button,
	LayoutScrollView,
	layoutStyle,
} from '@app/components/Themed'
import Carousel from '@app/components/Carousel'

interface SlideProps {
	title: string
	description: string
	image: React.FC<SvgProps>
}

function Slide({ title, description, image: Image }: SlideProps) {
	return (
		<View style={styles.slideContainer}>
			<View style={styles.slideImageContainer}>
				<Image {...styles.slideImage} />
			</View>
			<Text style={styles.slideTitle}>{title}</Text>
			<Text style={styles.slideDescription}>{description}</Text>
		</View>
	)
}

export default function AuthHome(props: AuthStackScreenProps<'Onboarding'>) {
	return (
		<LayoutScrollView>
			<View style={styles.container}>
				<Carousel
					data={onboarding}
					renderItem={({ item }) => <Slide {...item} />}
					keyExtractor={(item) => item.title}
					containerStyle={styles.sliderContainer}
				/>

				<View style={styles.innerContainer}>
					<Button onPress={() => props.navigation.navigate('Tab')}>
						Start
					</Button>
				</View>
			</View>
		</LayoutScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sliderContainer: {
		flex: 1,
	},
	slideContainer: {
		...layoutStyle,
		flex: 1,
	},
	slideTitle: {
		fontWeight: '600',
		fontSize: 24,
		textAlign: 'center',
		marginBottom: 16,
	},
	slideDescription: {
		textAlign: 'center',
		fontSize: 16,
		color: Colors.primary400,
	},
	slideImageContainer: {
		height: 360,
		maxHeight: '50%',
		paddingVertical: 16,
		marginBottom: 32,
	},
	slideImage: {
		width: '100%',
		maxHeight: '100%',
	},
	innerContainer: {
		paddingHorizontal: layoutStyle.paddingHorizontal,
		marginBottom: layoutStyle.marginBottom,
	},
})
