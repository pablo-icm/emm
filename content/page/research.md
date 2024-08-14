---
# Page title
title: Research
# Page type - we want a landing page (such as a homepage)
type: landing

# Your landing page sections - add as many different content blocks as you like
sections:
  # A section to display blog posts
  - block: collection
    id: research
    content:
      title: Research interests of the EMM group
      subtitle: 
      text: 
      # Display content from the `content/reserach/` folder
      filters:
        folders:
          - research
    design:
      # Choose how many columns the section has. Valid values: '1' or '2'.
      columns: '1'
      # Choose your content listing view - here we use the `showcase` view
      view: showcase
      # For the Showcase view, do you want to flip alternate rows?
      flip_alt_rows: true
---