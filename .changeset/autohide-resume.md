---
'@chassis-ui/react': patch
---

A `Toast` or `Notification` that autohides now resumes its countdown after a hover or focus with the time that was left, as the docs describe. Leaving restarted the whole `delay`, so a toast hovered 200 ms before it would have hidden stayed for another full `delay`.
