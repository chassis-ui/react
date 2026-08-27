import React, { Fragment, HTMLAttributes, useEffect, useMemo, useRef } from 'react'
import classNames from 'classnames'
import { useMeter } from 'react-aria'

import {
  calculateScore,
  defaultMessages,
  defaultThresholds,
  defaultWeights,
  scoreToStrength,
  STRENGTH_LEVELS,
  StrengthLevel,
  StrengthWeights
} from './strengthScore'

export interface PasswordStrengthProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * An accessible label for the meter. Defaults to `"Password strength"`.
   */
  'aria-label'?: string
  /**
   * A string of all className you want applied to the base component.
   */
  className?: string
  /**
   * `id` forwarded to the meter element.
   */
  id?: string
  /**
   * The maximum possible score, used to compute the meter's `aria-valuemax`. Defaults to the sum
   * of `weights`' values — set this explicitly when pairing a custom `scorer` whose scale doesn't
   * match the built-in criteria weights, otherwise `aria-valuenow`/`aria-valuemax` get silently
   * clamped to the built-in max.
   */
  maxScore?: number
  /**
   * Minimum password length required to earn the first strength point. Defaults to `8`.
   */
  minLength?: number
  /**
   * Feedback message shown for each strength level, when `showText` is `true`.
   */
  messages?: Partial<Record<StrengthLevel, string>>
  /**
   * Callback fired whenever the strength level changes, including once on mount with the
   * initial `value`'s strength.
   */
  onStrengthChange?: (result: { score: number; strength: StrengthLevel | null }) => void
  /**
   * Custom scoring function overriding the built-in criteria. Receives the password and returns
   * a numeric score.
   */
  scorer?: (password: string) => number
  /**
   * Renders a `.strength-text` element below the meter with the current level's message.
   * Defaults to `true`.
   */
  showText?: boolean
  /**
   * Score boundaries `[weak, fair, good]` — scores above the last value are `"strong"`. Defaults
   * to `[2, 4, 6]`.
   */
  thresholds?: [number, number, number]
  /**
   * The current password value to evaluate.
   */
  value: string
  /**
   * Render as four discrete segments, or a single growing bar. Defaults to `"segmented"`.
   */
  variant?: 'bar' | 'segmented'
  /**
   * Point values for each scoring criterion. Set a criterion to `0` to disable it. Merged with
   * the built-in defaults.
   */
  weights?: Partial<StrengthWeights>
}

export const PasswordStrength = ({
  'aria-label': ariaLabel = 'Password strength',
  className,
  id,
  maxScore,
  messages,
  minLength = 8,
  onStrengthChange,
  scorer,
  showText = true,
  thresholds = defaultThresholds,
  value,
  variant = 'segmented',
  weights,
  ...rest
}: PasswordStrengthProps) => {
  const mergedWeights = useMemo(() => ({ ...defaultWeights, ...weights }), [weights])
  const mergedMessages = useMemo(() => ({ ...defaultMessages, ...messages }), [messages])

  const score = useMemo(
    () => calculateScore(value, { minLength, scorer, weights: mergedWeights }),
    [value, minLength, scorer, mergedWeights]
  )
  const strength = useMemo(() => scoreToStrength(score, thresholds), [score, thresholds])
  const resolvedMaxScore = useMemo(
    () => maxScore ?? Object.values(mergedWeights).reduce((total, weight) => total + weight, 0),
    [maxScore, mergedWeights]
  )

  // Deliberately not initialized to `strength` — that would make the effect below skip firing
  // for the mount-time value, and a consumer using this to gate e.g. a submit button needs the
  // real initial state, not just subsequent changes.
  const previousStrength = useRef<StrengthLevel | null | undefined>(undefined)
  useEffect(() => {
    if (previousStrength.current !== strength) {
      previousStrength.current = strength
      onStrengthChange?.({ score, strength })
    }
  }, [strength, score, onStrengthChange])

  const { meterProps } = useMeter({
    'aria-label': ariaLabel,
    maxValue: resolvedMaxScore,
    minValue: 0,
    value: score,
    valueLabel: strength ? mergedMessages[strength] : undefined
  })

  const strengthIndex = strength ? STRENGTH_LEVELS.indexOf(strength) : -1

  return (
    <Fragment>
      <div
        {...meterProps}
        className={classNames(variant === 'bar' ? 'strength-bar' : 'strength', className)}
        data-cx-strength={strength ?? undefined}
        id={id}
        {...rest}
      >
        {variant === 'segmented' &&
          STRENGTH_LEVELS.map((level, index) => (
            <div
              className={classNames('strength-segment', { active: index <= strengthIndex })}
              key={level}
            />
          ))}
      </div>
      {showText && (
        <span aria-live="polite" className="strength-text" data-cx-strength={strength ?? undefined}>
          {strength ? mergedMessages[strength] : ''}
        </span>
      )}
    </Fragment>
  )
}

PasswordStrength.displayName = 'PasswordStrength'
