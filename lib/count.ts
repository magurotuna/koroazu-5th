import * as fs from 'fs'
import * as yaml from 'js-yaml'
import { currentDatetime, normalizeText, makeCounter, Counter } from './utils'

interface ConvertedCounterElement {
  name: string;
  count: number;
}

export type ConvertedCounter = ConvertedCounterElement[]

interface Songs {
  [key: string]: string[];
}

/**
 * @param songsYamlPath song情報を記したYAMLファイルへの絶対パス
 * @param tweetsOrJsonPath ツイート文の配列、もしくはツイートを出力したJSONファイルへの絶対パス
 * @param shouldOutput カウントの結果をファイルに出力するか否か
 */
export const count = (songsYamlPath: string, tweetsOrJsonPath: string[] | string, shouldOutput = true) => {
  const yamlText = fs.readFileSync(songsYamlPath).toString()
  const songs: Songs = yaml.safeLoad(yamlText)
  const songNames = Object.keys(songs)

  // キーが曲名、バリューが0のオブジェクト
  const counter = makeCounter(songNames)

  const tweets: string[] =
    typeof tweetsOrJsonPath === 'string'
      ? JSON.parse(fs.readFileSync(tweetsOrJsonPath).toString())
      : tweetsOrJsonPath

  tweets.forEach(tweet => {
    const converted = normalizeText(tweet)

    for (let key of songNames) {
      const patterns: string[] = songs[key].map(p => normalizeText(p))
      if (patterns.some(p => converted.includes(p))) {
        counter[key] += 1
      }
    }
  })

  const convertedCounter = convertCounter(counter)

  if (shouldOutput) {
    output(convertedCounter)
  }

  return convertedCounter
}

/**
 * {hoge: 0, piyo: 2} の形のcounterから、[{name: 'hoge', count: 0}, {name: 'piyo', count: 2}] のように変換した上で、降順にソートして返す
 * 変換するのは、配列のほうがソートが自然にできるため
 * @param counter 
 */
const convertCounter = (counter: Counter): ConvertedCounter => {
  const arr = []
  for (let key of Object.keys(counter)) {
    arr.push({
      name: key,
      count: counter[key]
    })
  }
  return arr.sort((a, b) => b.count - a.count)
}

const output = (counter: ConvertedCounter) => {
  // counter を出力
  const counterOutputFileName = `counter_${currentDatetime()}.json`
  fs.writeFile(`./output/${counterOutputFileName}`, JSON.stringify(counter), err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`output/${counterOutputFileName} にカウント結果を出力しました。`)
    }
  })
}