import * as puppeteer from 'puppeteer'

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  // ヤフーリアルタイム検索トップ
  await page.goto('https://search.yahoo.co.jp/realtime', { waitUntil: 'networkidle0' })

  // 検索欄に `#ころあず5周年` を入れる
  await page.type('#yschsp', '#ころあず5周年')
  // 検索実行
  await page.click('#sbn > fieldset > div.sbox_1.cf > input')
  // 読み込み終了を待機
  await page.waitFor('#TSm', { timeout: 100000 })
  // スクショ
  await page.screenshot({ path: 'test.png' })
  await browser.close()
}

main()