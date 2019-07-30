export const currentDatetime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const date = now.getDate()
  const hour = now.getHours()
  const minute = now.getMinutes()
  return `${year}-${month}-${date}_${hour}-${minute}`
}

// ref: [JavaScript で英数字や記号を全角から半角へ変換する方法](https://webllica.com/change-double-byte-to-half-width/)
export const toHalfWidth = (str: string) => {
  // 半角変換
  const halfVal = str.replace(/[！-～]/g,
    function (tmpStr) {
      // 文字コードをシフト
      return String.fromCharCode(tmpStr.charCodeAt(0) - 0xFEE0);
    }
  )
  // 文字コードシフトで対応できない文字の変換
  return halfVal.replace(/”/g, "\"")
    .replace(/’/g, "'")
    .replace(/‘/g, "`")
    .replace(/￥/g, "\\")
    .replace(/　/g, " ")
    .replace(/〜/g, "~")
}


export interface Counter {
  [key: string]: number;
}
// キーとなる配列を渡して、バリューがすべて0のMapを生成して返す
export const makeCounter = (keys: string[]): Counter => {
  const obj: Counter = {}
  keys.forEach(key => {
    obj[key] = 0
  })
  return obj
}
