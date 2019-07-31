import * as puppeteer from 'puppeteer'
import * as fs from 'fs'
import { currentDatetime } from './utils'

export const fetchTweets = async (shouldOutput = true) => {
  const devices = require('puppeteer/DeviceDescriptors')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.emulate(devices['iPad Pro'])

  // ヤフーリアルタイム検索トップ
  await page.goto('https://search.yahoo.co.jp/realtime', { waitUntil: 'networkidle0' })

  // 検索欄に `#ころあず5周年` を入れる
  await page.type('#yschsp', '#ころあず5周年')
  // 検索実行
  await page.click('#sbn > fieldset > div.sbox_1.cf > input')
  // 読み込み終了を待機
  await page.waitFor('#TSm', { timeout: 100000 })

  // infinite loading を読み込む要素がなくなるまで行う
  let tweetNum = 0 // 読み込み済みのツイート数。これが変化しなくなるまで読み込みを行う
  while (tweetNum !== (await page.$$('.cnt.cf')).length) {
    tweetNum = (await page.$$('.cnt.cf')).length
    console.log('取得済みツイート数:', tweetNum)

    const moreButton = await page.$('#btn_TSp_1')
    if (moreButton !== null) {
      try {
        await moreButton.click()
      } catch (e) {
        // 「もっと見る」が display: none でクリックできない場合はこのcatchブロックに来る
        // 一番下までスクロールをする
        await page.evaluate(() => {
          const rootElement = document.documentElement
          const bottomY = rootElement.scrollHeight - rootElement.clientHeight
          window.scroll(0, bottomY)
        })
      }
    }

    // とりあえず3秒待つ 待つ以外にスマートな方法ないかな...
    await page.waitFor(3000)
  }

  console.log('取得終了。総ツイート数:', tweetNum)

  const tweets = await page.evaluate(() => {
    const tweetContainers = document.querySelectorAll('.cnt.cf')
    const t: string[] = []
    tweetContainers.forEach(c => {
      const h2 = c.querySelector('h2')
      if (h2 !== null && !h2.innerText.startsWith('RT ')) { // `RT `から始まるツイートはリツイートなので除外
        t.push(h2.innerText)
      }
    })
    return t
  })
  await browser.close()

  if (shouldOutput) {
    output(tweets)
  }
  return tweets
}

const output = (tweets: string[]) => {
  const tweetOutputFileName = `tweets_${currentDatetime()}.json`
  fs.writeFile(`./output/${tweetOutputFileName}`, JSON.stringify(tweets), err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`output/${tweetOutputFileName} に取得したツイートを出力しました。`)
    }
  })
}