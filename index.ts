import * as puppeteer from 'puppeteer'

const main = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://search.yahoo.co.jp/realtime', { waitUntil: 'networkidle0' })
  await page.screenshot({ path: 'test.png' })
  await browser.close()
}

main()