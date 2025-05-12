import { ref } from 'vue'

export default function useAnimatedStats(initialValues: Record<string, number>) {
  const animatedValues = ref<Record<string, number>>({ ...initialValues })

  const startAnimation = (newValues: Record<string, number>) => {
    Object.keys(newValues).forEach((key) => {
      const startValue = animatedValues.value[key]
      const endValue = newValues[key]
      const duration = 100
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        animatedValues.value[key] = Math.round(startValue + (endValue - startValue) * progress)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    })
  }

  return {
    animatedValues,
    startAnimation,
  }
}
