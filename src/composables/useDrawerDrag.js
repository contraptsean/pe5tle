import { ref, computed } from 'vue'

const COLLAPSED_PX = 71
const MAX_VH = 75

export function useDrawerDrag() {
  const isExpanded = ref(false)
  const isDragging = ref(false)
  const dragStartY = ref(0)
  const dragDelta = ref(0)

  const maxPx = computed(() => window.innerHeight * (MAX_VH / 100))

  const currentHeight = computed(() => {
    const base = isExpanded.value ? maxPx.value : COLLAPSED_PX
    const h = base - dragDelta.value
    return Math.max(COLLAPSED_PX, Math.min(maxPx.value, h))
  })

  const drawerStyle = computed(() => {
    const style = { height: currentHeight.value + 'px' }
    if (isDragging.value) style.transition = 'none'
    return style
  })

  function toggleDrawer() {
    isExpanded.value = !isExpanded.value
    dragDelta.value = 0
  }

  function finishDrag() {
    const didDrag = Math.abs(dragDelta.value) > 5
    const threshold = 30

    if (didDrag) {
      const midpoint = (COLLAPSED_PX + maxPx.value) / 2
      if (currentHeight.value > midpoint) {
        isExpanded.value = true
      } else {
        isExpanded.value = false
      }
      if (!isExpanded.value && dragDelta.value < -threshold) {
        isExpanded.value = true
      } else if (isExpanded.value && dragDelta.value > threshold) {
        isExpanded.value = false
      }
    } else {
      isExpanded.value = !isExpanded.value
    }

    isDragging.value = false
    dragDelta.value = 0
  }

  function onTouchStart(e) {
    dragStartY.value = e.touches[0].clientY
    isDragging.value = true
  }

  function onTouchMove(e) {
    if (!isDragging.value) return
    dragDelta.value = e.touches[0].clientY - dragStartY.value
  }

  function onTouchEnd() {
    finishDrag()
  }

  function onMouseDown(e) {
    e.preventDefault()
    dragStartY.value = e.clientY
    isDragging.value = true

    const onMouseMove = (ev) => {
      if (!isDragging.value) return
      dragDelta.value = ev.clientY - dragStartY.value
    }

    const onMouseUp = () => {
      finishDrag()
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  function collapse() {
    isExpanded.value = false
    dragDelta.value = 0
  }

  return {
    isExpanded,
    isDragging,
    drawerStyle,
    toggleDrawer,
    collapse,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onMouseDown,
  }
}
