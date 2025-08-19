export const RandomString = (
  length: number,
  multiply = { numbers: 1, characters: 1, alts: 0 },
  includeSpecialChar = false,
) => {
  let result = ''
  const numbers = '0123456789'
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  const alts = !includeSpecialChar ? '' : '!@#$%^&*()_-?'
  const multiStr = (str: string, multi: number) => {
    for (let i = 1; i < multi; i++) {
      str += str
    }
    return str
  }
  const getMulti = (char: string, v_multi: number) =>
    v_multi <= 0 ? (result = '') : multiStr(char, v_multi)
  const vNumbers = getMulti(numbers, multiply.numbers)
  const vCharacters = getMulti(characters, multiply.characters)
  const vAlts = getMulti(alts, multiply.alts)
  const vInit = getMulti('', 0)
  const total = vInit + vNumbers + vCharacters + vAlts
  const strLength = total.length
  for (let i = 0; i < length; i++) {
    result += total.charAt(Math.floor(Math.random() * strLength))
  }
  return result
}

export const RandomNewArray = (
  arr: any[],
  newArrLength = 1,
  duplicate = false,
) => {
  const arrLength = arr.length
  const randNum = Math.random()
  const getRandNum = (arrLength: number) =>
    randNum < 1
      ? Math.floor(randNum * arrLength)
      : Math.floor(randNum * (arrLength - 1))
  const newArr = []
  if (duplicate) {
    for (let i = 0; i < newArrLength; i++) {
      const rand = getRandNum(arrLength)
      newArr.push(arr[rand])
    }
  } else {
    for (let i = 0; i < newArrLength; i++) {
      arr.splice(getRandNum(arr.length), 1)
      newArr.push(arr[getRandNum(arr.length)])
    }
  }
  return newArr
}
