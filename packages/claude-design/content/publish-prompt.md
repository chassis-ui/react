Publish the Chassis React design system to the Design System artifact {{url}} with the Artifact tool.

The files are the output of this repository's own build, `pnpm claude-design:build`, at commit {{ref}}, and `pnpm claude-design:check` has checked them: the page's size limits, the token format, and every component preview rendered in Chromium in every theme. They are under `{{root}}/project/`, one file for each file of the artifact's `project/` folder.

`{{root}}/publish.json` lists them. `files` maps each artifact path to its path under `{{root}}`. `manifest` gives each file's size and sha256. `scan` reports what the text files reference outside themselves: external URLs, `@import` rules, `<script` tags. Read `publish.json` and review the scan instead of reading the files. The bundles are about a megabyte each and the fonts are binary. Spot-check with Grep if something in the scan needs a closer look, and stop and report it if anything looks wrong.

Steps:

1. Call Artifact with action `read` and url {{url}}, with no path. A publish to an artifact the session has not read is refused.
2. Call Artifact with action `list`, scope `files`, and url {{url}}.
3. Find the paths to remove: every `project/` path in that listing that is not a key of `files`. Leave out `project/design-system.json`, which goes as `file_path` in step 4, and `project/manifest.json` and everything under `project/api/`, which the page generates.
4. Call Artifact once with action `publish`:
   - url {{url}}
   - root `{{root}}`
   - file_path `{{root}}/project/design-system.json`
   - files: the `files` object of `publish.json` exactly as written, plus `"<path>": null` for each path from step 3.

   Do not pass `capabilities`, `contract` or `icon`.

5. Reply with the first line of the publish result, or the exact error. Then list the paths you removed, and anything in the scan you found worth flagging. End with one line on its own: `RESULT: published <version id>` if the publish result says the artifact was updated, else `RESULT: failed <one-line reason>`.

Do nothing else: no other files, artifacts or tools.
