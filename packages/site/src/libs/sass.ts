import variables from '../scss/_tokens.module.scss'

export function sassVars(str: string): Record<string, string | undefined> {
  switch (str) {
    case 'color':
      return {
        primary: variables.colorPrimary,
        secondary: variables.colorSecondary,
        neutral: variables.colorNeutral,
        danger: variables.colorDanger,
        success: variables.colorSuccess,
        warning: variables.colorWarning,
        info: variables.colorInfo
      }
    case 'space':
      return {
        '4xs': variables.space4xs,
        '3xs': variables.space3xs,
        '2xs': variables.space2xs,
        xs: variables.spaceXsm,
        md: variables.spaceMedium,
        lg: variables.spaceLarge,
        xl: variables.spaceXlg,
        '2xl': variables.space2xl,
        '3xl': variables.space3xl,
        '4xl': variables.space4xl,
        '5xl': variables.space5xl,
        '6xl': variables.space6xl
      }
    case 'breakpoint':
      return {
        '2xl': variables.breakpoint2xl,
        xl: variables.breakpointXlg,
        lg: variables.breakpointLarge,
        md: variables.breakpointMedium,
        sm: variables.breakpointSmall
      }
    case 'container':
      return {
        '2xl': variables.container2xl,
        xl: variables.containerXlg,
        lg: variables.containerLarge,
        md: variables.containerMedium,
        sm: variables.containerSmall
      }
    case 'grid':
      return {
        gutter: variables.gridGutter
      }
    case 'modal':
      return {
        sm: variables.modalSmall,
        md: variables.modalMedium,
        lg: variables.modalLarge,
        xl: variables.modalXlg
      }
    case 'setting':
      return {
        baseFontSize: variables.baseFontSize || '16'
      }
    default:
      return {}
  }
}

export function sassSpaceValue(str: string) {
  const vars = sassVars('space')
  const value = vars[str]
  if (value?.endsWith('px')) {
    return `<code>${value}</code>`
  } else {
    return `<code>${value}</code> (<code>${value ? parseFloat(value) * parseFloat(sassVars('setting')['baseFontSize'] || '16') + 'px' : 'NaN'}</code>)`
  }
}

export function sassBreakpointSize(str: string) {
  const value = sassVars('breakpoint')[str]
  if (value?.endsWith('px')) {
    return value
  } else {
    return value
      ? parseFloat(value) * parseFloat(sassVars('setting')['baseFontSize'] || '16') + 'px'
      : 'NaN'
  }
}

export function sassContainerSize(str: string) {
  const value = sassVars('container')[str]
  if (value?.endsWith('px')) {
    return value
  } else {
    return value
      ? parseFloat(value) * parseFloat(sassVars('setting')['baseFontSize'] || '16') + 'px'
      : 'NaN'
  }
}

export function sassModalSize(str: string) {
  const value = sassVars('modal')[str]
  if (value?.endsWith('px')) {
    return value
  } else {
    return value
      ? parseFloat(value) * parseFloat(sassVars('setting')['baseFontSize'] || '16') + 'px'
      : 'NaN'
  }
}
