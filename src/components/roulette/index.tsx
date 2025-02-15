import React, {useRef, useImperativeHandle, forwardRef} from 'react'
import {Animated, Image as NativeImage, Text, View} from 'react-native'
import Svg, {Image, G, Path, Text as SvgText, TSpan} from 'react-native-svg'

interface Segment {
  id: number
  title: string
  text: string
}

export interface RouletteProps {
  segments: Segment[]
  winningSegment: Segment | null
  winningColor: string
  segColors: string[]
  textColors: string[]
  onFinished: (segment: Segment) => void
  strokeColor?: string
  size?: number
  upDuration?: number
  downDuration?: number
  outlineWidth?: number
}

export const Roulette = forwardRef<{spin: () => void}, RouletteProps>(
  (
    {
      segments,
      winningSegment,
      winningColor,
      segColors,
      textColors,
      onFinished,
      strokeColor = 'black',
      size = 300,
      upDuration = 300,
      downDuration = 1000,
      outlineWidth = 5,
    }: RouletteProps,
    ref,
  ) => {
    const svgRef = useRef<Svg>(null)
    const rotationAnim = useRef(new Animated.Value(0)).current

    const timerDelay = segments.length
    const upTime = segments.length * upDuration
    const downTime = segments.length * downDuration

    let timerHandle: number | NodeJS.Timeout = 0
    let spinStart = 0
    let angleCurrent = 0
    let angleDelta = 0
    let maxSpeed = Math.PI / segments.length

    const spin = () => {
      if (timerHandle === 0) {
        angleCurrent = Math.random() * Math.PI * 2
        spinStart = new Date().getTime()
        maxSpeed = Math.PI / segments.length
        timerHandle = setInterval(onTimerTick, timerDelay)
      }
    }

    const onTimerTick = () => {
      const duration = new Date().getTime() - spinStart
      let progress = 0
      let finished = false

      if (duration < upTime) {
        progress = duration / upTime
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2)
      } else {
        progress = duration / downTime
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2)
        if (progress >= 1) finished = true
      }

      angleCurrent += angleDelta
      while (angleCurrent >= Math.PI * 2) angleCurrent -= Math.PI * 2

      if (finished) {
        clearInterval(timerHandle)
        timerHandle = 0
        const rotationAdjustment = (angleCurrent + Math.PI / 2) % (Math.PI * 2)
        const segmentIndex = Math.floor((rotationAdjustment / (Math.PI * 2)) * segments.length)
        const winningSegmentIndex = (segments.length - segmentIndex - 1) % segments.length
        const winningSegment = segments[winningSegmentIndex]
        onFinished(winningSegment)
      }

      draw()
    }

    const draw = () => {
      Animated.timing(rotationAnim, {
        toValue: angleCurrent,
        duration: 0,
        useNativeDriver: true,
      }).start()
    }

    const defineColor = (index: number) => {
      if (winningSegment && index === winningSegment?.id - 1) {
        return winningColor
      } else {
        return segColors[index % segColors.length]
      }
    }

    const defineImage = (index: number) => {
      if (winningSegment && index === winningSegment?.id - 1) {
        return moneyIcon
      } else {
        return tagIcon
      }
    }

    useImperativeHandle(ref, () => ({spin}))

    const tagIcon = require('../../assets/images/tag.png')
    const moneyIcon = require('../../assets/images/money.png')
    const arrowIcon = require('../../assets/images/arrow.png')

    return (
      <View style={{alignItems: 'center', position: 'relative'}}>
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotationAnim.interpolate({
                  inputRange: [0, Math.PI * 2],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
            shadowColor: 'rgb(0, 0, 0)',
            shadowOffset: {width: 0, height: 0},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 10,
            borderRadius: size / 2,
          }}
        >
          <Svg ref={svgRef} width={size} height={size} viewBox={`-${outlineWidth / 2} -${outlineWidth / 2} ${size + outlineWidth} ${size + outlineWidth}`}>
            <G>
              {segments.map((_, index) => {
                const startAngle = (2 * Math.PI * index) / segments.length
                const endAngle = (2 * Math.PI * (index + 1)) / segments.length
                const arcPath = `M ${size / 2} ${size / 2} L ${size / 2 + (size / 2) * Math.cos(startAngle)} ${size / 2 + (size / 2) * Math.sin(startAngle)} A ${size / 2} ${
                  size / 2
                } 0 0 1 ${size / 2 + (size / 2) * Math.cos(endAngle)} ${size / 2 + (size / 2) * Math.sin(endAngle)} Z`

                return <Path key={index} d={arcPath} fill={defineColor(index)} stroke={strokeColor} strokeWidth={0} />
              })}

              {segments.map((segment, index) => {
                const startAngle = (2 * Math.PI * index) / segments.length
                const endAngle = (2 * Math.PI * (index + 1)) / segments.length
                const segmentAngle = startAngle + (endAngle - startAngle) / 2
                const radius = size / 2 - 30 - outlineWidth
                const x = size / 2 + radius * Math.cos(segmentAngle)
                const y = size / 2 + radius * Math.sin(segmentAngle)

                const rotationAngle = segmentAngle * (180 / Math.PI) + 90

                return (
                  <SvgText
                    key={index}
                    x={x}
                    y={y}
                    fill="black"
                    textAnchor="middle"
                    fontFamily="Arial"
                    fontWeight="bold"
                    fontSize="16"
                    transform={`rotate(${rotationAngle},${x},${y})`}
                  >
                    {segment.title}
                  </SvgText>
                )
              })}

              {segments.map((segment, index) => {
                const startAngle = (2 * Math.PI * index) / segments.length
                const endAngle = (2 * Math.PI * (index + 1)) / segments.length
                const segmentAngle = startAngle + (endAngle - startAngle) / 2
                const radius = size / 2 - 50
                const x = size / 2 + radius * Math.cos(segmentAngle)
                const y = size / 2 + radius * Math.sin(segmentAngle)

                const rotationAngle = segmentAngle * (180 / Math.PI) + 90

                return (
                  <SvgText
                    key={index}
                    x={x}
                    y={y}
                    fill={textColors[index % textColors.length]}
                    textAnchor="middle"
                    fontFamily="Arial"
                    fontSize="12"
                    transform={`rotate(${rotationAngle},${x},${y})`}
                  >
                    {segment?.text.split('\n').map((line, lineIndex) => (
                      <TSpan x={x} dy={lineIndex === 0 ? 0 : 14} key={lineIndex}>
                        {line}
                      </TSpan>
                    ))}
                  </SvgText>
                )
              })}

              {segments.map((_, index) => {
                const startAngle = (2 * Math.PI * index) / segments.length
                const endAngle = (2 * Math.PI * (index + 1)) / segments.length
                const segmentAngle = startAngle + (endAngle - startAngle) / 2
                const radius = size / 2 - 10
                const x = size / 2 + radius * Math.cos(segmentAngle)
                const y = size / 2 + radius * Math.sin(segmentAngle)

                const rotationAngle = segmentAngle * (180 / Math.PI) + 90

                return <Image key={index} x={x - 15} y={y + 65} width={30} height={30} href={defineImage(index)} transform={`rotate(${rotationAngle},${x},${y})`} />
              })}
            </G>
          </Svg>
        </Animated.View>

        <View
          style={{
            position: 'absolute',
            top: size / 2 - 20,
            left: 0,
            right: 0,
            alignItems: 'center',
            elevation: 99,
          }}
        >
          <Text style={{fontSize: 26, fontWeight: 'bold', color: 'black'}}>1</Text>
          <Text style={{fontSize: 12, color: 'black'}}>Chances</Text>
        </View>

        <View style={{position: 'absolute', top: -20, zIndex: 3, elevation: 99}}>
          <NativeImage style={{width: 30, height: 30, resizeMode: 'contain'}} source={arrowIcon} />
        </View>
      </View>
    )
  },
)
