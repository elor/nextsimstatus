import { flatten } from 'lodash'

export default function splitStates(state) {
  return flatten(state.split('+')
    .map(state => state.endsWith('*')
      ? [state.replace(/\**$/, ''), '*']
      : (state.endsWith('@')
        ? [state.replace(/@*$/, ''), 'REBOOT']
        : (state.endsWith('$')
          ? [state.replace(/\$*$/, ''), 'RESERVED']
          : state
        )
      )
    )
  )
}
