import * as path from 'path'
import { fetchTweets } from './lib/fetch-tweets'
import { count } from './lib/count'

const main = async () => {
  const tweets = await fetchTweets()
  const songsYamlPath = path.resolve(path.join(__dirname, 'lib', 'songs.yml'))
  const counter = count(songsYamlPath, tweets)
  console.log(counter)
}

main()
