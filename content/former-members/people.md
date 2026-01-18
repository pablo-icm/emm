---
# An instance of the People widget for Former Members
widget: people

# This file represents a page section.
headless: true

# Order that this section appears on the page.
weight: 10

title: Former Members
subtitle: People who contributed to EMM

content:
  # Only show Former members
  user_groups:
  - 'Former members'
  # Sort alphabetically by last name
  sort_by: Params.last_name
  sort_ascending: true

design:
  show_interests: false
  show_role: false
  show_social: true
---
