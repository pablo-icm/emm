---
# Slider widget for current projects
widget: slider

# This file represents a page section.
headless: true

# Activate this widget? true/false
active: true

# Order that this section appears on the page.
weight: 65

# Slide interval (in ms). Set to 0 to disable autoplay.
interval: 5000

# Slide height (optional). E.g. 400px
design:
  slide_height: '500px'
  is_fullscreen: false
  # Automatically transition through slides?
  loop: true

content:
  slides:
    - title: POLAROMICS
      content: 'Biogeography and Adaptation Mechanisms in Prokaryotes Across Polar Biomes (2024-2028)'
      align: center
      background:
        media: project-polaromics.jpg
        fit: cover
        position: center
        brightness: 0.5
      link:
        url: project/acinas-polaromics-2024/
        text: Learn more
        icon: arrow-right
        icon_pack: fas

    - title: EPIC
      content: 'Ecological characterization of Picozoa, an abundant and enigmatic protistan group (2023-2026)'
      align: center
      background:
        media: project-epic.jpg
        fit: cover
        position: center
        brightness: 0.5
      link:
        url: project/massana-epic-2023/
        text: Learn more
        icon: arrow-right
        icon_pack: fas
---
