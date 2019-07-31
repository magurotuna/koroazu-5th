import { normalizeText } from '../lib/utils'

test('normalizeText', () => {
  expect(normalizeText("Iｔ'ｓ　MyCUE.")).toBe("it'smycue.")
  expect(normalizeText("スロウ・リグレット")).toBe("スロウリグレット")
  expect(normalizeText("it's my cue fighter's high boom! boom! あずさとみんなで全力で騒ぎたいです #ころあず5周年")).toBe("it'smycuefighter'shighboom!boom!あずさとみんなで全力で騒ぎたいです#ころあず5周年")
})
