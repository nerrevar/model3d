// Returns false or string with error
const validatorFactory =
  (expr: RegExp, error: string) =>
    (text: string): false | string =>
      text.replace(expr, '') ? error : false

export const nonEmpty =
  (text:string) => !text.trim() ? 'Can not be empty' : false

export const lettersAndNumbers = validatorFactory(
  /[\sa-zA-Zа-яА-Я0-9]*/g,
  'Can contain only letters, numbers and spaces'
)

export const letters = validatorFactory(
  /[\sa-zA-Zа-яА-Я]*/g,
  'Can contain only letters'
)

export const ascii = validatorFactory(
  /[^0x00-0x7F]*/g,
  'Can contain only ASCII characters'
)
