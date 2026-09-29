# Security Policy

## Supported versions

`@chassis-ui/react` is pre-1.0. Only the latest published version gets fixes; there are no
maintenance branches for older versions.

## What to report

This repository holds two things that run for other people:

- **`@chassis-ui/react`**, the component library. It runs in your users' browsers and, with
  server rendering, on your servers. A way to run script through a component (for example
  through a prop, `href`, or children that should have been escaped), a component that
  exposes content it should not, or a published version that differs from what the source in
  this repository builds, is a vulnerability.
- **The docs site**, published at chassis-ui.com/react. A way to run script through its pages
  or examples is a vulnerability.

A problem in `@chassis-ui/css` or another Chassis project belongs to that project's
repository, even when it shows up in a component's rendering.

## Reporting a vulnerability

**Please don't open a public GitHub issue for a security vulnerability.**

Instead, use GitHub's private vulnerability reporting for this repository:
[github.com/chassis-ui/react/security/advisories/new](https://github.com/chassis-ui/react/security/advisories/new).
This opens a private thread visible only to you and the maintainers, so a fix can be released
before any public write-up.

If you can't use GitHub's private reporting, open a regular issue asking a maintainer to reach out
for a private channel, without including any details of the vulnerability.

We'll acknowledge new reports and keep you updated while we investigate and fix a confirmed issue.
Please give us reasonable time to release a fix before any public disclosure.
