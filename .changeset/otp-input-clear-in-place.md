---
'@chassis-ui/react': patch
---

`OtpInput`: Backspace on a filled box clears that box in place, as otp-input.mdx says, and a key other than a digit does nothing. Both used to rebuild the boxes from the code as one string with no gaps, so every later digit moved one box left: correcting the third digit of `123456` gave `1 2 4 5 6 _`. The boxes now keep what was typed in each, and the digits after a box cleared inside the code can still be focused to correct them. `onChange` still reports the digits as one string, `12456` for `1 2 _ 4 5 6`, and a code that comes from elsewhere (a controlled `value` that differs from it, a form reset) fills the boxes from the first. A non-digit key no longer calls `onChange` with the unchanged code.
